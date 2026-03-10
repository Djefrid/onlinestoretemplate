import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { resend, isResendConfigured, FROM_EMAIL } from "@/lib/resend/client";
import { buildPasswordResetEmail } from "@/lib/resend/emails/passwordReset";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Honeypot anti-bot
  if (body.website) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createServiceClient();
  } catch {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }

  // Generate password reset link server-side (no email sent by Supabase)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${BASE_URL}/auth/callback?next=/account`,
    },
  });

  // SECURITY: Always return 200 — don't reveal whether the email exists
  if (error || !data?.properties?.action_link) {
    // User not found or other error — silent success to prevent email enumeration
    return NextResponse.json({ success: true });
  }

  // Send reset email via Resend
  if (isResendConfigured && resend) {
    try {
      const { subject, html } = buildPasswordResetEmail({
        resetUrl: data.properties.action_link,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      });
    } catch (emailErr) {
      console.error("[api/auth/reset-password] Failed to send reset email:", emailErr);
    }
  } else {
    console.warn(
      "[api/auth/reset-password] Resend not configured — reset URL:",
      data.properties.action_link,
    );
  }

  return NextResponse.json({ success: true });
}
