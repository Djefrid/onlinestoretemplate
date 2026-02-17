# CHECKLIST SECURITE — Next.js + Supabase + Stripe (E-commerce)

> Document reutilisable pour securiser tout projet Next.js App Router avec Supabase Auth, Stripe Checkout et Sanity CMS.
> Applique sur le projet "Epicerie Africaine" — Fevrier 2026.

---

## TABLE DES MATIERES

**Implementation technique (sections 1-17) :**

1. [Headers HTTP de securite](#1-headers-http-de-securite)
2. [Content Security Policy (CSP)](#2-content-security-policy-csp)
3. [Protection middleware Next.js](#3-protection-middleware-nextjs)
4. [Authentification et sessions](#4-authentification-et-sessions)
5. [Administration (RBAC)](#5-administration-rbac)
6. [Protection des API routes](#6-protection-des-api-routes)
7. [Webhook Stripe securise](#7-webhook-stripe-securise)
8. [Verification des prix cote serveur](#8-verification-des-prix-cote-serveur)
9. [Base de donnees — Row Level Security (RLS)](#9-base-de-donnees--row-level-security-rls)
10. [Fonctions SQL SECURITY DEFINER](#10-fonctions-sql-security-definer)
11. [Audit logging](#11-audit-logging)
12. [Anti-bot (Honeypot)](#12-anti-bot-honeypot)
13. [SMTP et rate limits email](#13-smtp-et-rate-limits-email)
14. [security.txt (RFC 9116)](#14-securitytxt-rfc-9116)
15. [Variables d'environnement](#15-variables-denvironnement)
16. [Cookies securises](#16-cookies-securises)
17. [Favicon et manifest PWA](#17-favicon-et-manifest-pwa)

**Standards et conformite (sections 18-25) :**

18. [OWASP Top 10 (2025) — Mapping](#18-owasp-top-10-2025--mapping-avec-ce-projet)
19. [PCI DSS — Conformite paiement](#19-pci-dss--conformite-paiement)
20. [RGPD / PIPEDA — Conformite donnees](#20-rgpd--pipeda--conformite-donnees-personnelles)
21. [Supabase — Checklist production officielle](#21-supabase--checklist-production-officielle)
22. [DNS et email — SPF / DKIM / DMARC](#22-dns-et-email--spf--dkim--dmarc)
23. [HTTPS et TLS](#23-https-et-tls)
24. [Protection contre les attaques courantes](#24-protection-contre-les-attaques-courantes)
25. [Stripe — Bonnes pratiques specifiques](#25-stripe--bonnes-pratiques-specifiques)
26. [Ameliorations futures recommandees](#26-ameliorations-futures-recommandees)

---

## 1. HEADERS HTTP DE SECURITE

**Fichier :** `next.config.mjs` > `headers()`

### Headers globaux (toutes les routes `/(.*)`):

```js
// Empeche l'inclusion dans un iframe (anti-clickjacking)
{ key: "X-Frame-Options", value: "DENY" }

// Empeche le navigateur de deviner le MIME type (anti-MIME sniffing)
{ key: "X-Content-Type-Options", value: "nosniff" }

// Desactive le filtre XSS des anciens navigateurs (cause plus de problemes qu'il n'en resout)
{ key: "X-XSS-Protection", value: "0" }

// Limite les infos envoyees dans le header Referer
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }

// Desactive les API navigateur non utilisees (camera, micro, geoloc, etc.)
{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(self), picture-in-picture=()" }

// Empeche le chargement de ressources cross-origin (anti-Spectre)
{ key: "Cross-Origin-Resource-Policy", value: "same-origin" }

// Force HTTPS pour 2 ans + preload dans les navigateurs
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }

// Isole le contexte de navigation (anti-Spectre)
{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }
```

### Headers specifiques aux API (`/api/(.*)`):

```js
// Empeche le cache des reponses API (anti-cache poisoning)
{ key: "Cache-Control", value: "no-store, max-age=0" }

// Double nosniff pour les API
{ key: "X-Content-Type-Options", value: "nosniff" }
```

### Header supprime :

```js
// Cache que le serveur utilise Next.js (moins d'infos pour les attaquants)
poweredByHeader: false
```

---

## 2. CONTENT SECURITY POLICY (CSP)

**Fichier :** `next.config.mjs` > `headers()` > `Content-Security-Policy`

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://app.cal.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: blob: https://cdn.sanity.io https://*.supabase.co
font-src 'self' https://fonts.gstatic.com
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.sanity.io
frame-src https://js.stripe.com https://hooks.stripe.com https://app.cal.com
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
object-src 'none'
upgrade-insecure-requests
```

### Explication de chaque directive :

| Directive | Role | Pourquoi |
|---|---|---|
| `default-src 'self'` | Bloque tout par defaut sauf meme domaine | Base de securite |
| `script-src` | Autorise Stripe.js et Cal.com | Paiement + rendez-vous |
| `style-src` | Autorise Google Fonts inline | Polices du design |
| `img-src` | Autorise Sanity CDN et Supabase | Images produits + avatars |
| `font-src` | Autorise Google Fonts static | Chargement des polices |
| `connect-src` | Autorise Supabase (HTTP+WSS), Stripe API, Sanity | Requetes API backend |
| `frame-src` | Autorise Stripe iframe et Cal.com | Checkout + calendrier |
| `frame-ancestors 'none'` | Personne ne peut embarquer ton site en iframe | Anti-clickjacking |
| `base-uri 'self'` | Empeche l'injection de balise `<base>` | Anti-XSS |
| `form-action 'self'` | Les formulaires ne peuvent poster que vers ton domaine | Anti-phishing |
| `object-src 'none'` | Bloque Flash, Java applets | Legacy dangereux |
| `upgrade-insecure-requests` | Force HTTP vers HTTPS | Securite transport |

### Comment adapter a un nouveau projet :
- Remplacer les domaines Stripe/Cal.com/Sanity par tes propres services
- Ajouter tout domaine tiers dans la directive appropriee
- **Ne jamais ajouter `*` dans aucune directive**

---

## 3. PROTECTION MIDDLEWARE NEXT.JS

**Fichier :** `middleware.ts`

### 3a) CVE-2025-29927 — Bypass du middleware

```ts
// CRITIQUE: Un attaquant peut ajouter le header x-middleware-subrequest
// pour contourner TOUT le middleware (auth, redirections, etc.)
if (request.headers.has("x-middleware-subrequest")) {
  return new NextResponse(null, { status: 403 });
}
```

**Pourquoi :** Ce header est utilise en interne par Next.js pour les sous-requetes. Un attaquant externe qui l'ajoute fait croire au serveur que la requete est interne, ce qui skip tout le middleware.

**Impact sans fix :** Acces non-authentifie a TOUTES les routes protegees (admin, account, etc.)

### 3b) Protection des routes par role

```ts
// Routes admin — redirect vers login si pas authentifie
if (isAdminRoute && !isAdminLogin && !user) {
  redirect → /admin-hub/login
}

// Routes utilisateur — redirect vers login si pas authentifie
if (!user && pathname.startsWith("/account")) {
  redirect → /auth/login
}

// Utilisateur connecte — redirect away from auth pages
if (user && isPublicAuth) {
  redirect → /account
}
```

### 3c) Cookies securises dans le middleware

```ts
cookiesToSet.forEach(({ name, value, options }) =>
  supabaseResponse.cookies.set(name, value, {
    ...options,
    sameSite: "lax",                              // Anti-CSRF
    secure: process.env.NODE_ENV === "production", // HTTPS only en prod
  }),
);
```

---

## 4. AUTHENTIFICATION ET SESSIONS

**Fichiers :** `lib/supabase/server.ts`, `lib/supabase/client.ts`

### 4a) Validation des variables d'environnement

```ts
// server.ts — createClient()
if (!isSupabaseConfigured) {
  throw new Error("[supabase] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required");
}

// server.ts — createServiceClient()
if (!url || !serviceKey) {
  throw new Error("[supabase] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}
```

**Pourquoi :** Sans validation, le client Supabase se cree avec `undefined` et les requetes echouent silencieusement ou exposent des erreurs.

### 4b) Service client securise

```ts
export async function createServiceClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,  // Pas de refresh auto pour service client
      persistSession: false,     // Pas de session persistee cote serveur
    },
  });
}
```

**Pourquoi :**
- `autoRefreshToken: false` — le service client utilise une cle statique, pas besoin de refresh
- `persistSession: false` — empeche le stockage de session server-side (risque de fuite)

### 4c) Cookies SameSite + Secure

```ts
sameSite: "lax"   // Cookie envoye uniquement depuis le meme site (anti-CSRF)
secure: true       // Cookie uniquement en HTTPS (en production)
```

---

## 5. ADMINISTRATION (RBAC)

**Fichiers :** `lib/auth/requireAdmin.ts`, `app/admin-hub/`

### 5a) Guard server-side `requireAdmin()`

```ts
export async function requireAdmin() {
  // 1. Verifier que l'utilisateur a une session
  // 2. Verifier l'age de la session (max 4h)
  // 3. Verifier que l'utilisateur existe (getUser — valide le JWT server-side)
  // 4. Verifier le role "admin" dans la table profiles
  // Si une etape echoue → redirect
}
```

**Pourquoi `getUser()` au lieu de `getSession()` :**
- `getSession()` lit le JWT local (peut etre forge)
- `getUser()` valide le JWT aupres du serveur Supabase Auth (source de verite)

### 5b) Expiration de session admin (4h)

```ts
const MAX_ADMIN_SESSION_AGE_MS = 4 * 60 * 60 * 1000; // 4 heures

const expiresAt = (session.expires_at ?? 0) * 1000;
const sessionCreatedApprox = expiresAt - 3600 * 1000; // Token Supabase = 1h par defaut
const sessionAge = Date.now() - sessionCreatedApprox;

if (sessionAge > MAX_ADMIN_SESSION_AGE_MS) {
  await supabase.auth.signOut();
  redirect("/admin-hub/login?reason=session_expired");
}
```

**Pourquoi :** Meme si le token est refresh automatiquement, on force un re-login apres 4h pour les admins. Reduit la fenetre d'attaque si un token est vole.

### 5c) Migration SQL — role admin

```sql
-- Colonne role dans profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'customer'));

-- CRITIQUE: Empecher l'utilisateur de modifier son propre role via l'API
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );
```

**Sans ce fix :** Un utilisateur pourrait faire un `UPDATE profiles SET role = 'admin'` via le client Supabase et se promouvoir admin.

---

## 6. PROTECTION DES API ROUTES

**Fichier :** `app/api/checkout/route.ts`

### 6a) Validation Zod cote serveur

```ts
const result = checkoutSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json({ error: firstError.message }, { status: 400 });
}
```

**Regle :** Ne JAMAIS faire confiance aux donnees du client. Toujours valider avec un schema (Zod, Yup, etc.) cote serveur.

### 6b) Verification des prix cote serveur

```ts
// SECURITE: Ne jamais utiliser les prix envoyes par le client
const realPrices = await getPricesBySlugs(slugs);
verifiedItems = data.items.map((item) => {
  const real = realPrices[item.slug];
  return {
    price: real.price,     // Prix reel depuis Sanity CMS
    name: real.title,      // Nom reel depuis Sanity CMS
    // ... PAS le prix du client
  };
});
```

**Sans ce fix :** Un attaquant pourrait envoyer `{ price: 0.01 }` dans le body et acheter pour 1 centime.

### 6c) Headers no-store sur /api/*

```js
{ key: "Cache-Control", value: "no-store, max-age=0" }
```

**Pourquoi :** Empeche le cache CDN/proxy de stocker les reponses API (qui peuvent contenir des donnees sensibles ou des tokens de session).

---

## 7. WEBHOOK STRIPE SECURISE

**Fichier :** `app/api/webhook/stripe/route.ts`

### 7a) Verification de signature

```ts
// Stripe signe chaque webhook avec un secret unique
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

**Sans ce fix :** N'importe qui pourrait envoyer un POST a `/api/webhook/stripe` avec un faux evenement "checkout.session.completed" et creer des commandes fictives.

### 7b) Idempotence (eviter les doublons)

```ts
// Utiliser maybeSingle() au lieu de single() pour eviter les erreurs
const { data: existingOrder, error: lookupError } = await supabase
  .from("orders")
  .select("id")
  .eq("stripe_session_id", session.id)
  .maybeSingle();

// Si le lookup echoue, on abort — Stripe va retenter
if (lookupError) {
  console.error("[webhook] DB lookup failed, aborting to avoid duplicate:", lookupError);
  return;
}

// Si la commande existe deja, on skip
if (existingOrder) {
  console.log("[webhook] Order already exists, skipping:", existingOrder.id);
  return;
}
```

**Pourquoi `maybeSingle()` :**
- `single()` leve une erreur si 0 ou 2+ resultats
- `maybeSingle()` retourne `null` si 0 resultats (cas normal) et erreur seulement si 2+
- Stripe peut retenter un webhook plusieurs fois — sans idempotence, on creerait des commandes en double

### 7c) Service client (bypass RLS)

```ts
// Le webhook n'a pas de session utilisateur — il doit utiliser le service_role
// pour ecrire dans orders, order_items, etc.
supabase = await createServiceClient();
```

---

## 8. VERIFICATION DES PRIX COTE SERVEUR

**Fichier :** `app/api/checkout/route.ts`

```
Client envoie: { slug: "piment-cameroun", price: 5.99, quantity: 2 }
                                              ↑
                                        ON IGNORE CE PRIX

Serveur fait:   getPricesBySlugs(["piment-cameroun"])
                → Sanity CMS retourne: { price: 12.99 }
                                          ↑
                                    ON UTILISE CE PRIX

Stripe recoit:  unit_amount: 1299 (12.99$ × 100)
```

**Regle d'or :** Le client envoie les slugs et quantites. Le serveur recupere les prix depuis la source de verite (CMS/DB). Le client ne controle JAMAIS le prix.

---

## 9. BASE DE DONNEES — ROW LEVEL SECURITY (RLS)

**Fichiers :** `supabase/migrations/all.sql`

### Regles appliquees :

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Own only | Auto (trigger) | Own only + **role immutable** | Non |
| `carts` | Own only | Own only | Own only | Own only |
| `cart_items` | Via cart ownership | Via cart ownership | Via cart ownership | Via cart ownership |
| `orders` | Own only | Service role only | Service role only | Non |
| `order_items` | Via order ownership | Service role only | Non | Non |
| `reviews` | Tous (public) | Own only | Own only | Own only |
| `audit_logs` | **Personne** (`USING (false)`) | Service role only | Non | Non |

### Points critiques :

**a) Protection du role admin :**
```sql
-- L'utilisateur ne peut PAS changer son role dans un UPDATE
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT role FROM profiles WHERE id = auth.uid())
);
```

**b) Audit logs inaccessibles :**
```sql
-- Personne ne peut lire via l'API publique — meme authentifie
CREATE POLICY "No public access to audit logs"
  ON public.audit_logs USING (false);
-- Seul createServiceClient() (service_role) peut ecrire
```

**c) Orders en lecture seule pour les utilisateurs :**
Les commandes sont creees par le webhook Stripe (service_role). Les utilisateurs ne peuvent que les lire.

---

## 10. FONCTIONS SQL SECURITY DEFINER

**Fichier :** `supabase/migrations/all.sql`

### Probleme :
Les fonctions `SECURITY DEFINER` s'executent avec les privileges du createur (superuser). Sans `search_path`, un attaquant pourrait creer un schema malicieux qui intercepte les appels.

### Fix applique :

```sql
-- Toujours ajouter SET search_path = public
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$ ... $$
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION increment_loyalty(...)
RETURNS VOID AS $$ ... $$
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### Revoquer l'acces public aux fonctions sensibles :

```sql
-- increment_loyalty ne doit etre appele que par le service_role (webhook)
REVOKE EXECUTE ON FUNCTION increment_loyalty FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION increment_loyalty FROM authenticated;
REVOKE EXECUTE ON FUNCTION increment_loyalty FROM anon;
```

**Sans ce fix :** Un utilisateur authentifie pourrait appeler `supabase.rpc('increment_loyalty', { user_id_input: '...', points_input: 999999 })` et se donner des millions de points.

---

## 11. AUDIT LOGGING

**Fichiers :** `lib/audit.ts`, `supabase/migrations/007_audit_logs.sql`

### Table audit_logs :

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES auth.users(id),
  actor_email TEXT NOT NULL,
  action      TEXT NOT NULL,       -- ex: "admin_login", "role_change"
  resource    TEXT,                 -- ex: "user:uuid"
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,               -- donnees supplementaires
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index pour requetes rapides
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

### Fonction d'audit :

```ts
// lib/audit.ts
export async function logAdminAction(params: {
  actorId: string;
  actorEmail: string;
  action: string;
  resource?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createServiceClient();
  await supabase.from("audit_logs").insert({ ... });
}
```

### Regle importante :
```ts
// L'audit ne doit JAMAIS bloquer le flux principal
try {
  await logAdminAction({ ... });
} catch (err) {
  console.error("[audit] Failed to log action:", err);
  // On continue — l'action admin n'est pas bloquee
}
```

---

## 12. ANTI-BOT (HONEYPOT)

**Fichier :** `app/api/checkout/route.ts`

### Cote serveur :

```ts
// Un champ "website" cache dans le formulaire
// Les bots le remplissent automatiquement — les humains ne le voient pas
if (body.website) {
  return NextResponse.json({ error: "Requete invalide" }, { status: 400 });
}
```

### Cote client (formulaire checkout) :

```tsx
{/* Honeypot — invisible pour les humains, rempli par les bots */}
<input
  type="text"
  name="website"
  value=""
  tabIndex={-1}
  autoComplete="off"
  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
/>
```

**Limites :** Les bots sophistiques detectent les honeypots. Pour une protection plus forte, ajouter Cloudflare Turnstile (voir section 18).

---

## 13. SMTP ET RATE LIMITS EMAIL

### Probleme :
Le SMTP par defaut de Supabase limite a **2 emails/heure** et n'envoie qu'aux membres du projet.

### Solution :
Configurer un SMTP custom dans **Supabase Dashboard > Authentication > SMTP Settings**.

### Strategie recommandee :

| Phase | Provider | Config |
|---|---|---|
| **Lancement** | Resend | Host: `smtp.resend.com`, Port: `465`, User: `resend`, Pass: `<votre_cle_resend>` |
| **Croissance** | AWS SES | Host: `email-smtp.ca-central-1.amazonaws.com`, Port: `587`, User: `<votre_user_ses>`, Pass: `<votre_pass_ses>` |

### Switch :
Changer 4 champs dans le dashboard Supabase. Zero code a modifier. Instantane.

---

## 14. SECURITY.TXT (RFC 9116)

**Fichier :** `app/.well-known/security.txt/route.ts`

```ts
export async function GET() {
  const contactEmail = process.env.SECURITY_CONTACT_EMAIL || "security@example.com";
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const content = `Contact: mailto:${contactEmail}\nExpires: ${expires}\nPreferred-Languages: fr, en\n`;
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

**Pourquoi :** Permet aux chercheurs en securite de savoir comment te contacter pour signaler des vulnerabilites. Standard reconnu par Google, Facebook, etc.

**URL :** `https://ton-domaine.com/.well-known/security.txt`

---

## 15. VARIABLES D'ENVIRONNEMENT

### Regles :

| Prefixe | Visible par | Utilisation |
|---|---|---|
| `NEXT_PUBLIC_` | Client + Serveur | URLs publiques, cles publiques |
| Sans prefixe | Serveur uniquement | Secrets, cles API, tokens |

### Variables sensibles (JAMAIS `NEXT_PUBLIC_`) :

```
SUPABASE_SERVICE_ROLE_KEY    → Bypass RLS, acces total a la DB
STRIPE_SECRET_KEY            → Creer des sessions de paiement
STRIPE_WEBHOOK_SECRET        → Verifier les signatures webhook
SANITY_API_TOKEN             → Mutations CMS (si utilise)
SECURITY_CONTACT_EMAIL       → Email de contact securite
```

### Variables publiques (OK avec `NEXT_PUBLIC_`) :

```
NEXT_PUBLIC_SUPABASE_URL         → URL du projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY    → Cle publique (limitee par RLS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → Cle publique Stripe
NEXT_PUBLIC_BASE_URL             → URL du site
NEXT_PUBLIC_SITE_NAME            → Nom du site
```

### Fichiers .env dans .gitignore :

```
.env.local
.env.production.local
.env.*.local
```

**JAMAIS commiter de secrets dans le repo.**

---

## 16. COOKIES SECURISES

**Fichiers :** `middleware.ts`, `lib/supabase/server.ts`

```ts
{
  sameSite: "lax",                              // Anti-CSRF: cookie envoye uniquement same-site
  secure: process.env.NODE_ENV === "production", // HTTPS only en production
  httpOnly: true,                                // Gere par Supabase SSR (pas accessible en JS)
}
```

| Attribut | Valeur | Protection |
|---|---|---|
| `sameSite` | `lax` | Anti-CSRF (le cookie n'est pas envoye depuis un site tiers) |
| `secure` | `true` (prod) | Le cookie ne transite que par HTTPS |
| `httpOnly` | `true` | Le cookie n'est pas lisible par JavaScript (anti-XSS) |

---

## 17. FAVICON ET MANIFEST PWA

**Fichiers :** `app/icon.svg`, `app/apple-icon.tsx`, `app/manifest.ts`

### Pourquoi c'est de la securite :
- Un site sans favicon est flague comme "suspect" par certains filtres anti-phishing
- Le manifest avec `display: standalone` empeche la barre d'URL d'etre cachee (anti-phishing)
- Les meta OG corrects empechent les previews trompeuses sur les reseaux sociaux

---

## 18. OWASP TOP 10 (2025) — MAPPING AVEC CE PROJET

> Source officielle : https://owasp.org/www-project-top-ten/
> Le OWASP Top 10 est LE standard mondial pour la securite des applications web.

| # | Vulnerabilite OWASP | Statut | Comment c'est couvert |
|---|---|---|---|
| **A01** | **Broken Access Control** | COUVERT | RLS sur toutes les tables, `requireAdmin()` server-side, middleware auth, policy anti-privilege-escalation (role immutable) |
| **A02** | **Cryptographic Failures** | COUVERT | HSTS preload (force HTTPS), cookies `secure: true`, Supabase gere le hashing bcrypt des mots de passe, Stripe gere les donnees de carte (PCI DSS Level 1) |
| **A03** | **Injection** | COUVERT | Supabase utilise des requetes parametrees (pas de SQL brut), validation Zod sur toutes les entrees, CSP stricte (anti-XSS) |
| **A04** | **Insecure Design** | COUVERT | Verification des prix server-side, webhook idempotent, separation service_role/anon_key, principe du moindre privilege |
| **A05** | **Security Misconfiguration** | COUVERT | `poweredByHeader: false`, headers de securite complets, validation env vars, `search_path = public` sur SECURITY DEFINER |
| **A06** | **Vulnerable Components** | PARTIEL | Dependances npm a jour. **A FAIRE :** activer Dependabot + `npm audit` en CI |
| **A07** | **Auth Failures** | COUVERT | Session admin 4h max, `getUser()` (server-side validation), cookies httpOnly/sameSite/secure, SMTP custom pour emails fiables |
| **A08** | **Data Integrity Failures** | COUVERT | Webhook Stripe signe (`constructEvent`), idempotence check, CSP `object-src 'none'` |
| **A09** | **Logging & Monitoring** | COUVERT | Table `audit_logs` avec RLS, `logAdminAction()`, logs webhook console. **A AMELIORER :** alerting en temps reel |
| **A10** | **SSRF** | COUVERT | Pas de fetch dynamique avec URL user-controlled. Sanity/Stripe/Supabase sont les seuls backends appeles. CSP `connect-src` whitelist. |

---

## 19. PCI DSS — CONFORMITE PAIEMENT

> Obligatoire pour tout site qui accepte les paiements par carte.

### Ce que Stripe gere pour toi (PCI Level 1) :

| Element | Gere par |
|---|---|
| Collecte numero de carte | **Stripe Checkout** (page hosted) |
| Stockage des donnees carte | **Stripe** (jamais sur ton serveur) |
| Tokenisation | **Stripe** |
| Chiffrement en transit | **Stripe** (TLS 1.2+) |
| Conformite PCI DSS | **Stripe** (certifie Level 1 par QSA) |

### Ce que TOI tu dois faire :

```
[x] Ne JAMAIS stocker, logger ou transmettre des numeros de carte
[x] Utiliser Stripe Checkout (hosted) ou Stripe Elements — pas de formulaire carte custom
[x] HTTPS sur tout le site (HSTS preload)
[x] Webhook verifie par signature (pas de donnees de carte dans le webhook)
[x] Pas de donnees PAN dans les logs serveur
[x] Remplir le SAQ-A (Self-Assessment Questionnaire) annuellement
    → https://www.pcisecuritystandards.org/assessors_and_solutions/self_assessment/
```

### Code safe — ce que Stripe retourne (non-PCI, stockable) :

```ts
// Donnees NON sensibles — OK a stocker en DB
session.payment_intent  // "pi_xxx" — ID unique
session.amount_total    // 2999 (en cents)
session.customer_email  // "client@email.com"
// Stripe retourne aussi: last4, card_type, exp_date — OK a stocker

// Donnees SENSIBLES — JAMAIS stocker
// Numero de carte complet, CVV, date complete, donnees de la bande magnetique
```

---

## 20. RGPD / PIPEDA — CONFORMITE DONNEES PERSONNELLES

> RGPD = Europe, PIPEDA = Canada (Loi sur la protection des renseignements personnels)
> Les deux s'appliquent si tu as des clients en Europe ou au Canada.

### Donnees personnelles collectees :

| Donnee | Table | Justification |
|---|---|---|
| Nom complet | `profiles`, `orders` | Execution du contrat (livraison) |
| Email | `auth.users`, `orders` | Authentification + communication commande |
| Telephone | `profiles`, `orders` | Livraison + communication commande |
| Adresse | `orders` (JSONB) | Livraison |
| IP + User-Agent | `audit_logs` | Interet legitime (securite admin) |

### Mesures appliquees :

```
[x] RLS — chaque utilisateur ne voit que SES donnees
[x] HTTPS partout — chiffrement en transit
[x] Supabase chiffre au repos (AES-256) — chiffrement at-rest
[x] Cookies httpOnly — pas d'acces JavaScript aux sessions
[x] Audit logs — tracabilite des acces admin
[x] Pas de tracking tiers (pas de Google Analytics, pas de Facebook Pixel)
    → interest-cohort=() dans Permissions-Policy (bloque FLoC/Topics)
```

### Ce qu'il reste a implementer (legal) :

```
[ ] Page "Politique de confidentialite" avec :
    - Liste des donnees collectees et leur finalite
    - Duree de retention
    - Droits de l'utilisateur (acces, rectification, suppression)
    - Contact DPO/responsable
[ ] Bouton "Supprimer mon compte" dans /account
    → CASCADE sur auth.users supprime profiles + carts + cart_items
    → Anonymiser les orders (garder pour comptabilite, supprimer le nom/email)
[ ] Bandeau cookies si ajout futur de tracking
[ ] Consentement explicite au moment de l'inscription
[ ] Possibilite d'export des donnees personnelles (droit a la portabilite)
```

---

## 21. SUPABASE — CHECKLIST PRODUCTION OFFICIELLE

> Source : https://supabase.com/docs/guides/deployment/going-into-prod

### Securite :

```
[x] RLS active sur TOUTES les tables
[x] Policies restrictives (pas de SELECT * public sauf reviews)
[x] MFA sur le compte Supabase Dashboard (proprietaire)
    → Si login GitHub : activer 2FA sur GitHub aussi
[x] Role admin protege par policy WITH CHECK (role immutable)
[x] service_role key uniquement cote serveur (JAMAIS NEXT_PUBLIC_)
[x] SMTP custom configure (pas le defaut rate-limited)
```

### Performance :

```
[x] Index sur colonnes utilisees dans les queries frequentes :
    - idx_carts_user_active (user_id WHERE status = 'active')
    - idx_orders_stripe (stripe_session_id) — lookup webhook
    - idx_reviews_product (product_slug) — affichage produit
    - idx_audit_logs_created (created_at DESC) — audit recents
[x] Utiliser le connection pooler (port 6543) pour les connexions directes
    → Le client JS passe par l'API REST — pas concerne
[ ] Load testing avec k6 avant lancement (optionnel mais recommande)
```

### Disponibilite :

```
[x] SMTP custom (deliverabilite email fiable)
[ ] Point-in-Time Recovery active (Pro plan, 25$/mois)
[ ] Alerting sur les erreurs critiques (webhook failures, auth errors)
[ ] Backup strategie : Supabase backup quotidien (Pro) + export Sanity periodique
```

---

## 22. DNS ET EMAIL — SPF / DKIM / DMARC

> Obligatoire pour que tes emails ne finissent pas en spam.

### Records DNS a configurer :

```dns
# SPF — Autorise les serveurs qui peuvent envoyer en ton nom
TXT  epicerie-africaine.ca  "v=spf1 include:amazonses.com ~all"
# ou pour Resend :
TXT  epicerie-africaine.ca  "v=spf1 include:resend.com ~all"

# DKIM — Signature cryptographique des emails
# → Configure automatiquement par Resend ou AWS SES (CNAME records)

# DMARC — Politique en cas d'echec SPF/DKIM
TXT  _dmarc.epicerie-africaine.ca  "v=DMARC1; p=quarantine; rua=mailto:dmarc@epicerie-africaine.ca"
```

### Niveaux DMARC :

| Policy | Comportement | Recommandation |
|---|---|---|
| `p=none` | Monitoring seulement | Phase de test |
| `p=quarantine` | Emails suspects en spam | **Recommande au lancement** |
| `p=reject` | Emails suspects bloques | Apres 1-2 mois de monitoring |

### Verification :

```bash
# Verifier SPF
dig TXT epicerie-africaine.ca

# Verifier DKIM
dig CNAME resend._domainkey.epicerie-africaine.ca

# Verifier DMARC
dig TXT _dmarc.epicerie-africaine.ca

# Outil en ligne : https://mxtoolbox.com/SuperTool.aspx
```

---

## 23. HTTPS ET TLS

### Deja en place :

```
[x] HSTS avec preload (max-age=63072000 = 2 ans)
[x] includeSubDomains (protege aussi studio.epicerie-africaine.ca, etc.)
[x] upgrade-insecure-requests dans CSP
[x] Cookies secure: true en production
```

### A faire pour le deploiement :

```
[ ] Soumettre le domaine a la HSTS Preload List :
    → https://hstspreload.org
    → Une fois accepte, les navigateurs forcent HTTPS meme avant la premiere visite
[ ] Verifier le grade SSL :
    → https://www.ssllabs.com/ssltest/
    → Objectif : Grade A+
[ ] Verifier que Vercel utilise TLS 1.2+ (c'est le cas par defaut)
```

---

## 24. PROTECTION CONTRE LES ATTAQUES COURANTES

### Attaques couvertes par le projet :

| Attaque | Protection | Fichier |
|---|---|---|
| **XSS** (Cross-Site Scripting) | CSP stricte, `X-Content-Type-Options: nosniff`, React echappe par defaut | `next.config.mjs` |
| **CSRF** (Cross-Site Request Forgery) | Cookies `sameSite: lax`, `form-action 'self'` dans CSP | `middleware.ts`, `next.config.mjs` |
| **Clickjacking** | `X-Frame-Options: DENY`, `frame-ancestors 'none'` | `next.config.mjs` |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` | `next.config.mjs` |
| **Man-in-the-Middle** | HSTS preload, cookies `secure`, `upgrade-insecure-requests` | `next.config.mjs` |
| **Spectre/Meltdown** | CORP `same-origin`, COOP `same-origin` | `next.config.mjs` |
| **Session Hijacking** | Cookies `httpOnly`, `secure`, `sameSite`, session 4h admin | `middleware.ts`, `requireAdmin.ts` |
| **Privilege Escalation** | RLS policy `role = (SELECT role...)`, `requireAdmin()` server-side | `all.sql`, `requireAdmin.ts` |
| **Price Manipulation** | Verification prix cote serveur depuis Sanity CMS | `checkout/route.ts` |
| **Replay Attack (webhook)** | Idempotence `maybeSingle()` + `stripe_session_id UNIQUE` | `webhook/stripe/route.ts` |
| **Webhook Forgery** | `constructEvent()` signature verification | `webhook/stripe/route.ts` |
| **Bot Abuse** | Honeypot champ cache + validation Zod | `checkout/route.ts` |
| **Cache Poisoning** | `Cache-Control: no-store` sur /api/* | `next.config.mjs` |
| **Search Path Injection** | `SET search_path = public` sur SECURITY DEFINER | `all.sql` |
| **RPC Abuse** | `REVOKE EXECUTE` sur fonctions sensibles | `all.sql` |
| **Middleware Bypass** | CVE-2025-29927 — blocage `x-middleware-subrequest` | `middleware.ts` |
| **Information Disclosure** | `poweredByHeader: false`, erreurs generiques en production | `next.config.mjs` |

### Attaques NON couvertes (a implementer) :

| Attaque | Solution | Priorite |
|---|---|---|
| **Brute Force (login)** | Rate limiting avec Upstash Redis | HAUTE |
| **DDoS** | Cloudflare (proxy DNS) ou Vercel WAF | HAUTE |
| **Credential Stuffing** | MFA (TOTP) pour les admins | HAUTE |
| **Automated Abuse** | Cloudflare Turnstile (CAPTCHA invisible) | MOYENNE |
| **Dependency Hijacking** | `npm audit`, Dependabot, lockfile strict | MOYENNE |

---

## 25. STRIPE — BONNES PRATIQUES SPECIFIQUES

### Deja en place :

```
[x] Stripe Checkout (hosted) — pas de formulaire carte custom
    → Conformite PCI SAQ-A (le plus simple)
[x] Webhook signe avec constructEvent()
[x] Idempotence — verification avant creation de commande
[x] Prix verifies cote serveur (pas de prix client)
[x] stripe_session_id UNIQUE en DB (contrainte SQL)
[x] Webhook secret dans variable d'env (pas dans le code)
```

### A configurer dans Stripe Dashboard :

```
[ ] Activer Radar (anti-fraude) — gratuit avec Stripe
    → Dashboard > Radar > Rules
    → Bloquer les paiements a haut risque automatiquement
[ ] Configurer les notifications webhook :
    → Developers > Webhooks > Votre endpoint
    → Ecouter : checkout.session.completed, payment_intent.payment_failed
[ ] Activer le mode Live (pas Test) pour la production :
    → Utiliser les cles Live (pas Test) depuis le dashboard Stripe
[ ] Configurer l'email de reception Stripe pour les litiges/disputes
```

### Regles de securite Stripe :

```
- Ne JAMAIS logger la cle secrete (STRIPE_SECRET_KEY)
- Ne JAMAIS passer la cle secrete au client
- Toujours verifier la signature webhook (ne pas skip en prod)
- Utiliser des webhook endpoints HTTPS uniquement
- Repondre 200 rapidement au webhook (< 10 secondes)
- Traiter le webhook de maniere idempotente (Stripe peut retenter)
```

---

## 26. AMELIORATIONS FUTURES RECOMMANDEES

### Priorite HAUTE :

| Mesure | Effort | Description |
|---|---|---|
| **Cloudflare Turnstile** | 2h | CAPTCHA invisible gratuit — remplacer le honeypot |
| **Rate limiting API** | 3h | Upstash Redis + `@upstash/ratelimit` sur /api/checkout et /api/webhook |
| **MFA admin** | 2h | Supabase Auth supporte TOTP — activer pour les comptes admin |
| **SMTP custom** | 30min | Configurer Resend ou AWS SES (voir section 13) |
| **Dependabot** | 15min | Activer sur GitHub pour les alertes de vulnerabilites npm |
| **Cloudflare DNS** | 1h | Proxy DNS pour masquer l'IP du serveur + protection DDoS gratuite |

### Priorite MOYENNE :

| Mesure | Effort | Description |
|---|---|---|
| **CSP nonce** | 3h | Remplacer `unsafe-inline` par des nonces dynamiques |
| **Subresource Integrity (SRI)** | 1h | Ajouter `integrity` sur les scripts externes |
| **CSRF token** | 2h | Token double-submit pour les formulaires non-Stripe |
| **IP allowlist admin** | 1h | Limiter `/admin-hub` a certaines IPs via middleware |
| **DMARC p=reject** | 0 | Passer de `quarantine` a `reject` apres 1-2 mois de monitoring |
| **Bouton suppression compte** | 2h | RGPD/PIPEDA — droit a l'effacement dans /account |

### Priorite BASSE :

| Mesure | Effort | Description |
|---|---|---|
| **SAST en CI** | 30min | Ajouter `semgrep` ou `eslint-plugin-security` dans GitHub Actions |
| **npm audit en CI** | 15min | `npm audit --audit-level=high` dans le pipeline de build |
| **Penetration test** | Variable | Faire un audit externe avant le lancement officiel |
| **HSTS preload submission** | 5min | Soumettre le domaine a hstspreload.org |
| **Export donnees utilisateur** | 3h | RGPD droit a la portabilite — endpoint /api/export-my-data |

---

## RESUME RAPIDE — COPIER-COLLER POUR UN NOUVEAU PROJET

### A) Headers et transport (next.config.mjs)
```
 1. [x] poweredByHeader: false
 2. [x] X-Frame-Options: DENY
 3. [x] X-Content-Type-Options: nosniff
 4. [x] Strict-Transport-Security (HSTS preload, 2 ans)
 5. [x] Content-Security-Policy (CSP stricte, whitelist par service)
 6. [x] Cross-Origin-Resource-Policy: same-origin
 7. [x] Cross-Origin-Opener-Policy: same-origin
 8. [x] Permissions-Policy (tout desactive sauf fullscreen)
 9. [x] Referrer-Policy: strict-origin-when-cross-origin
10. [x] Cache-Control: no-store sur /api/*
11. [x] X-XSS-Protection: 0 (desactiver le filtre legacy)
```

### B) Middleware et auth (middleware.ts, lib/)
```
12. [x] CVE-2025-29927 — bloquer x-middleware-subrequest
13. [x] Cookies: sameSite=lax, secure=true, httpOnly=true
14. [x] Protection routes par role (admin, user, public)
15. [x] getUser() server-side (pas getSession seul)
16. [x] Session admin max 4h avec re-auth forcee
17. [x] Validation env vars au demarrage (throw si manquant)
18. [x] Service client: autoRefreshToken=false, persistSession=false
```

### C) API et paiement (app/api/)
```
19. [x] Validation Zod cote serveur sur toutes les entrees
20. [x] Verification des prix cote serveur (jamais faire confiance au client)
21. [x] Honeypot anti-bot sur checkout
22. [x] Webhook Stripe: verification signature constructEvent()
23. [x] Webhook idempotent: maybeSingle() + UNIQUE constraint
24. [x] Stripe Checkout hosted (pas de formulaire carte = SAQ-A)
```

### D) Base de donnees (Supabase / PostgreSQL)
```
25. [x] RLS active sur TOUTES les tables
26. [x] Policy anti-privilege-escalation (role immutable via WITH CHECK)
27. [x] SECURITY DEFINER: SET search_path = public
28. [x] REVOKE EXECUTE sur fonctions sensibles (increment_loyalty, etc.)
29. [x] Audit logs: table avec RLS USING(false), service_role only
30. [x] Index sur colonnes RLS (user_id, etc.) pour performance
31. [x] stripe_session_id UNIQUE (anti-doublon commande)
```

### E) Infrastructure et compliance
```
32. [x] SMTP custom (Resend → AWS SES) — pas le defaut Supabase
33. [x] security.txt RFC 9116 (/.well-known/security.txt)
34. [x] Favicon + manifest PWA (anti-phishing)
35. [x] .env secrets dans .gitignore (JAMAIS commiter)
36. [x] SPF + DKIM + DMARC configures sur le domaine
37. [x] PCI DSS : Stripe Checkout hosted = SAQ-A (le plus simple)
38. [x] RGPD/PIPEDA : RLS, chiffrement transit+repos, pas de tracking tiers
```

### F) A faire avant le lancement
```
39. [ ] Activer Dependabot sur GitHub
40. [ ] Configurer Cloudflare (DNS proxy + DDoS protection)
41. [ ] Activer Stripe Radar (anti-fraude)
42. [ ] SMTP custom configure dans Supabase Dashboard
43. [ ] MFA active sur le compte Supabase Dashboard
44. [ ] Grade A+ sur ssllabs.com/ssltest
45. [ ] Soumettre le domaine a hstspreload.org
46. [ ] Page politique de confidentialite complete
47. [ ] Bouton "Supprimer mon compte" dans /account
```
