import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PROVINCES = ["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"] as const;

const profileUpdateSchema = z.object({
  full_name: z.string().max(100).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  address_line1: z.string().max(200).nullable().optional(),
  address_line2: z.string().max(200).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  postal_code: z.string().max(10).nullable().optional(),
  province: z.enum(PROVINCES).optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json(null, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, address_line1, address_line2, city, postal_code, province")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      id: user.id,
      email: user.email,
      full_name: profile?.full_name ?? null,
      phone: profile?.phone ?? null,
      address_line1: profile?.address_line1 ?? null,
      address_line2: profile?.address_line2 ?? null,
      city: profile?.city ?? null,
      postal_code: profile?.postal_code ?? null,
      province: profile?.province ?? null,
    });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
    }

    const parsed = profileUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const d = parsed.data;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: d.full_name?.trim() ?? null,
        phone: d.phone?.trim() ?? null,
        address_line1: d.address_line1?.trim() ?? null,
        address_line2: d.address_line2?.trim() ?? null,
        city: d.city?.trim() ?? null,
        postal_code: d.postal_code?.trim() ?? null,
        province: d.province ?? "QC",
      })
      .eq("id", user.id);

    if (error) {
      console.error("[api/user/profile] Update error:", error.code);
      return NextResponse.json({ error: "Impossible de mettre à jour le profil" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
