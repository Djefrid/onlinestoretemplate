-- ═══════════════════════════════════════════════════
-- 7 — Table audit_logs pour traçabilité admin
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES auth.users(id),
  actor_email TEXT NOT NULL,
  action      TEXT NOT NULL,
  resource    TEXT,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Seul le service_role peut écrire — personne ne lit via API publique
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to audit logs"
  ON public.audit_logs
  USING (false);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
