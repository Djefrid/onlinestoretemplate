import { createServiceClient } from "@/lib/supabase/server";

/**
 * Log an admin action for audit trail.
 * Uses the service client (bypasses RLS) since audit_logs blocks all public access.
 */
export async function logAdminAction(params: {
  actorId: string;
  actorEmail: string;
  action: string;
  resource?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const supabase = await createServiceClient();
    await supabase.from("audit_logs").insert({
      actor_id: params.actorId,
      actor_email: params.actorEmail,
      action: params.action,
      resource: params.resource,
      ip_address: params.ip,
      user_agent: params.userAgent,
      metadata: params.metadata,
    });
  } catch (err) {
    // Never let audit logging break the app flow
    console.error("[audit] Failed to log action:", err);
  }
}
