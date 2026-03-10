import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { resend, isResendConfigured, FROM_EMAIL } from "@/lib/resend/client";
import { buildEmailVerificationEmail } from "@/lib/resend/emails/emailVerification";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  // Honeypot anti-bot
  const body = await request.json();
  if (body.website) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { email, password, full_name } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 },
    );
  }

  let supabase;
  try {
    supabase = await createServiceClient();
  } catch {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }

  // Generate signup confirmation link server-side (no email sent by Supabase)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name },
      redirectTo: `${BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    // User already exists → friendly message
    if (error.message.toLowerCase().includes("already registered")) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse email." },
        { status: 409 },
      );
    }
    console.error("[api/auth/signup] generateLink error:", error.message);
    return NextResponse.json({ error: "Erreur lors de la création du compte." }, { status: 400 });
  }

  const verificationUrl = data.properties?.action_link;
  if (!verificationUrl) {
    console.error("[api/auth/signup] No action_link returned");
    return NextResponse.json({ error: "Erreur lors de la génération du lien." }, { status: 500 });
  }

  // Send verification email via Resend
  if (isResendConfigured && resend) {
    try {
      const { subject, html } = buildEmailVerificationEmail({
        customerName: full_name,
        verificationUrl,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      });
    } catch (emailErr) {
      // Non-blocking — user was created, but email failed
      // Log and continue: user can request a new link later
      console.error("[api/auth/signup] Failed to send verification email:", emailErr);
    }
  } else {
    // Resend not configured (local dev without key)
    console.warn("[api/auth/signup] Resend not configured — verification URL:", verificationUrl);
  }

  return NextResponse.json({ success: true });
}
