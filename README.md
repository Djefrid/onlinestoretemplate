# Boutique Africaine — E-commerce Afro-Minimaliste

E-commerce de produits africains authentiques (épices, produits frais, soins naturels) avec paiement Stripe, authentification Supabase et prise de rendez-vous Cal.com.

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Styles | Tailwind CSS |
| CMS | Sanity.io v3 (catalogue produits, catégories) |
| Auth + DB | Supabase (PostgreSQL, Auth, RLS) |
| Paiement | Stripe Checkout + Webhooks |
| Rendez-vous | Cal.com (embed inline) |
| Cart (invité) | Zustand + localStorage |
| Déploiement | Docker + docker-compose (Coolify/VPS) |

## Architecture du monorepo

```
my-shop/
├── apps/
│   ├── web/               # Next.js 14 (port 3007 en dev)
│   │   ├── app/           # Pages (App Router)
│   │   │   ├── admin-hub/ # Panel admin (login + dashboard)
│   │   │   ├── auth/      # Authentification publique
│   │   │   └── api/       # Routes API (checkout, webhook)
│   │   ├── components/    # Composants UI + layout + admin
│   │   ├── lib/           # Clients (Sanity, Supabase, Stripe), utils
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # CSS global
│   └── studio/            # Sanity Studio v3
├── supabase/
│   └── migrations/        # SQL (tables, RLS, indexes, RPC, sécurité)
├── seed/                  # Script de seed Sanity
├── docker-compose.yml
└── README.md
```

## Variables d'environnement

Copier `.env.example` en `.env.local` dans `apps/web/` :

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Requise | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Non* | ID du projet Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Non | Dataset Sanity (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Non | Version API Sanity |
| `SANITY_API_TOKEN` | Non* | Token avec droits d'écriture |
| `NEXT_PUBLIC_SUPABASE_URL` | Non* | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Non* | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Non* | Clé service (webhook, bypass RLS) |
| `STRIPE_SECRET_KEY` | Non* | Clé secrète Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Non* | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | Non* | Secret webhook Stripe (`whsec_...`) |
| `NEXT_PUBLIC_CALCOM_EMBED_URL` | Non | URL Cal.com (ex: `username/event`) |
| `NEXT_PUBLIC_BASE_URL` | Oui | URL de base (`http://localhost:3007`) |
| `NEXT_PUBLIC_SITE_NAME` | Non | Nom du site |
| `NEXT_PUBLIC_SHIPPING_COST` | Non | Frais de livraison (défaut: `5.99`) |
| `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` | Non | Seuil livraison gratuite (défaut: `75`) |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Non | URL du studio Sanity (admin hub) |
| `NEXT_PUBLIC_STRIPE_DASHBOARD_URL` | Non | URL du dashboard Stripe (admin hub) |
| `NEXT_PUBLIC_SUPABASE_DASHBOARD_URL` | Non | URL du dashboard Supabase (admin hub) |
| `NEXT_PUBLIC_CAL_DASHBOARD_URL` | Non | URL du dashboard Cal.com (admin hub) |

*L'app démarre sans ces variables grâce aux fallbacks mock/graceful degradation.

## Installation

```bash
# 1. Cloner le repo
git clone <repo-url> && cd my-shop

# 2. Installer les dépendances
cd apps/web && npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# 4. Appliquer les migrations Supabase
# Via le dashboard Supabase > SQL Editor, exécuter dans l'ordre :
#   supabase/migrations/all.sql (script complet)
#   Ou individuellement :
#   supabase/migrations/001_init.sql
#   supabase/migrations/002_rls_policies.sql
#   supabase/migrations/003_indexes.sql
#   supabase/migrations/004_loyalty_rpc.sql
#   supabase/migrations/005_admin_role.sql
#   supabase/migrations/006_security_fixes.sql

# 5. Lancer le dev server
npm run dev -- -p 3007

# 6. (Optionnel) Lancer Sanity Studio
cd ../studio && npm install && npm run dev

# 7. (Optionnel) Seed des données Sanity
cd ../../seed && node seed-sanity.mjs
```

## Base de données Supabase

### Tables

| Table | Description |
|-------|------------|
| `profiles` | Profils utilisateur (auto-créé au signup via trigger, colonne `role`: admin/customer) |
| `carts` | Paniers persistants (statut: `active` / `converted`) |
| `cart_items` | Articles du panier |
| `orders` | Commandes (créées par le webhook Stripe) |
| `order_items` | Articles de commande |
| `reviews` | Avis produit (1 par user par produit) |
| `audit_logs` | Traçabilité admin (RLS bloqué, écriture service_role uniquement) |

### RLS (Row Level Security)

Toutes les tables ont RLS activé :
- **profiles** : lecture/modification de son propre profil (le champ `role` ne peut pas être modifié par l'utilisateur)
- **carts/cart_items** : CRUD sur ses propres paniers
- **orders/order_items** : lecture de ses propres commandes
- **reviews** : lecture publique, CRUD sur ses propres avis
- **audit_logs** : aucun accès public (RLS bloqué), écriture uniquement via service_role

Le webhook utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS.

### Migrations

```
supabase/migrations/
├── 001_init.sql              # Tables, enums, trigger handle_new_user
├── 002_rls_policies.sql      # 14 RLS policies (role protégé)
├── 003_indexes.sql           # 7 indexes de performance
├── 004_loyalty_rpc.sql       # Fonction increment_loyalty
├── 005_admin_role.sql        # Colonne role (admin/customer)
├── 006_security_fixes.sql    # Correctifs sécurité (RLS, RPC, search_path)
├── 007_audit_logs.sql        # Table audit_logs pour traçabilité admin
└── all.sql                   # Script complet (toutes migrations)
```

## Admin Hub

### Accès administrateur

Le panel admin est une zone 100% indépendante du site public :
- **URL** : `/admin-hub` (dashboard) et `/admin-hub/login` (connexion)
- **Design** : dark mode dédié, aucun élément du site public (pas de header/footer public)
- **Sécurité** : rôle `admin` vérifié côté serveur + côté client, pas de création de compte
- **Header admin** : 3 éléments uniquement — Badge Admin, Voir le site, Déconnexion

### Créer un administrateur

Le rôle admin ne peut être attribué que via SQL (aucune auto-promotion possible).

**Via le dashboard Supabase :**

1. **Authentication > Users > Add user** (email + mot de passe, cocher Auto-confirm)
2. **SQL Editor > New Query :**

```sql
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@exemple.com');
```

**Via la ligne de commande (Supabase CLI) :**

```bash
supabase link --project-ref VOTRE_PROJECT_REF
supabase db execute --sql "UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@exemple.com');"
```

### Cartes du dashboard admin

| Carte | Service | Description |
|-------|---------|-------------|
| Contenu & Produits | Sanity Studio | Gestion catalogue, catégories, textes |
| Finances & Commandes | Stripe Dashboard | Paiements, remboursements, litiges |
| Base Clients | Supabase Dashboard | Utilisateurs, commandes, données |
| Planning RDV | Cal.com | Disponibilités, rendez-vous |

## Auth Supabase

### Flux d'authentification

- **Inscription** : `/auth/register` → email de vérification → callback → `/account`
- **Connexion** : `/auth/login` → `signInWithPassword` → redirect
- **Déconnexion** : bouton dans `/account` → `signOut` → accueil
- **Middleware** : refresh auto du token, protection `/account`, redirect `/auth/*` si déjà connecté

### Panier synchronisé

| État | Stockage |
|------|----------|
| Invité | Zustand + localStorage |
| Connecté | Merge local/remote au login, push Supabase sur mutations |

## Stripe

### Flux de paiement

```
/checkout (formulaire) → POST /api/checkout → Stripe Checkout Session
  → Paiement → POST /api/webhook/stripe (signature vérifiée)
    → Vérif. idempotence (stripe_session_id UNIQUE)
    → INSERT orders + order_items (Supabase)
    → UPDATE carts SET status = 'converted'
    → Incrément loyalty_points
  → Redirect /success → ClearCart (vide localStorage)
```

### Test en local

```bash
# Installer Stripe CLI
# Windows: scoop install stripe | Mac: brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:3007/api/webhook/stripe
# Copier le whsec_... dans .env.local

# Carte de test : 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123
```

## Routes

| Route | Type | Description |
|-------|------|------------|
| `/` | Static | Accueil (Hero, Catégories, Best-sellers) |
| `/shop` | Dynamic | Catalogue avec filtres et recherche |
| `/products` | Redirect | Redirection permanente (301) vers `/shop` |
| `/product/[slug]` | Dynamic | Fiche produit détaillée |
| `/cart` | Static | Panier (Zustand) |
| `/checkout` | Static | Formulaire commande (pré-rempli si connecté) |
| `/success` | Dynamic | Confirmation de paiement |
| `/cancel` | Static | Annulation de paiement |
| `/auth/login` | Static | Connexion |
| `/auth/register` | Static | Inscription |
| `/auth/callback` | Dynamic | Callback OAuth |
| `/account` | Dynamic | Profil + historique commandes |
| `/appointments` | Static | Prise de rendez-vous (Cal.com) |
| `/legal/terms` | Static | CGV |
| `/legal/privacy` | Static | Politique de confidentialité |
| `/legal/refunds` | Static | Retours et remboursements |
| `/legal/imprint` | Static | Mentions légales |
| `/admin-hub` | Dynamic | Dashboard admin (rôle admin requis) |
| `/admin-hub/login` | Static | Connexion admin (formulaire dédié) |
| `/api/checkout` | API | Crée une session Stripe (prix vérifiés côté serveur) |
| `/api/webhook/stripe` | API | Webhook Stripe (signature vérifiée) |
| `/robots.txt` | SEO | Robots.txt |
| `/sitemap.xml` | SEO | Sitemap dynamique (pages + produits) |

## Docker

```bash
# Build et démarrage
docker-compose up --build -d

# Le site est accessible sur http://localhost:3000
```

Le Dockerfile utilise le mode `standalone` de Next.js pour une image optimisée (~150 MB).
Compatible Coolify : pointer le docker-compose.yml et configurer les variables d'environnement dans l'interface.

## GitHub Action — Anti-pause Supabase

Le fichier `.github/workflows/keep-alive.yml` contient un cron job qui s'exécute toutes les 72h pour empêcher la pause automatique du projet Supabase (free tier).

**Secrets GitHub requis :**

| Secret | Description |
|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `SITE_URL` | URL de production du site |

Configurer dans **GitHub > Settings > Secrets and variables > Actions > New repository secret**.

## Favicons

Les favicons sont dans `apps/web/app/` :

| Fichier | Taille | Usage |
|---------|--------|-------|
| `favicon.ico` | 48×48 | Favicon navigateur (ICO multi-taille) |
| `icon.png` | 512×512 | PWA, Android, raccourcis |
| `apple-icon.png` | 180×180 | Apple Touch Icon (iOS) |

Next.js App Router détecte automatiquement ces fichiers et génère les balises `<link>` appropriées.

## Sécurité

### Headers HTTP

Tous les headers de sécurité sont configurés dans `next.config.mjs` :

| Header | Valeur | Protection |
|--------|--------|------------|
| `Content-Security-Policy` | Whitelist Stripe, Sanity, Supabase, Cal.com | XSS, injection de scripts |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuite de données |
| `Permissions-Policy` | Caméra, micro, géoloc, paiement, USB, capture écran désactivés | Abus de fonctionnalités |
| `Cross-Origin-Opener-Policy` | `same-origin` | Attaques cross-origin |
| `Cross-Origin-Resource-Policy` | `same-origin` | Spectre / side-channel |
| `Cache-Control` (API) | `no-store, max-age=0` sur `/api/*` | Cache poisoning |
| `X-Powered-By` | Supprimé (`poweredByHeader: false`) | Masque le framework |

### Protections appliquées

| Risque | Protection |
|--------|------------|
| **Auto-promotion admin** | RLS `WITH CHECK` empêche la modification du champ `role` |
| **Points de fidélité illimités** | `increment_loyalty` restreint au service_role uniquement |
| **Manipulation des prix** | Prix vérifiés côté serveur via Sanity avant envoi à Stripe |
| **Open redirect** | Toutes les redirections auth validées (doit commencer par `/`, pas `//`) |
| **Brute force admin** | Verrouillage après 5 tentatives côté client |
| **Fuite d'erreur webhook** | Message générique retourné, détails en log serveur uniquement |
| **Cookies non sécurisés** | `SameSite=Lax` + `Secure=true` en production |
| **SQL injection search_path** | `SET search_path = public` sur toutes les fonctions `SECURITY DEFINER` |
| **Mot de passe faible** | Minimum 8 caractères (norme NIST) |
| **CVE-2025-29927** | Header `x-middleware-subrequest` bloqué dans le middleware |
| **Bots / spam checkout** | Honeypot anti-bot sur la route `/api/checkout` |
| **Session admin trop longue** | Expiration forcée après 4h, re-authentification obligatoire |
| **Webhook double traitement** | `maybeSingle()` + vérification erreur DB avant traitement |
| **Traçabilité admin** | Table `audit_logs` (RLS bloqué, écriture service_role uniquement) |
| **Service client mal configuré** | Validation obligatoire de `SUPABASE_SERVICE_ROLE_KEY` |
| **security.txt** | Route `/.well-known/security.txt` (RFC 9116) |

### Règles importantes

- **JAMAIS** préfixer une clé secrète avec `NEXT_PUBLIC_` (elle serait exposée côté client)
- **JAMAIS** commiter `.env.local` ou `.env` (ils sont dans `.gitignore`)
- Le webhook Stripe vérifie la signature avec `constructEvent()` sur chaque requête
- Le `SUPABASE_SERVICE_ROLE_KEY` bypass toutes les RLS — utilisé uniquement dans les routes API serveur
- Les pages admin sont exclues des moteurs de recherche (`robots: noindex, nofollow`)

Pour une checklist détaillée de sécurité, voir **[SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)**.

## Design tokens

| Token | Valeur |
|-------|--------|
| Background | `#F9F9F7` |
| Foreground | `#1A1A1A` |
| Accent | `#CCA43B` |
| Accent dark | `#B8922F` |
| Font body | Inter |
| Font display | Playfair Display |

## Checklist de tests

### Admin Hub
- [ ] `/admin-hub` redirige vers `/admin-hub/login` si non connecté
- [ ] `/admin-hub/login` : formulaire dark mode, pas de "Créer un compte"
- [ ] Connexion admin avec email/mot de passe (rôle admin requis)
- [ ] Connexion refusée si le compte n'est pas admin
- [ ] Verrouillage après 5 tentatives échouées
- [ ] Dashboard : 4 cartes (Sanity, Stripe, Supabase, Cal.com)
- [ ] Header admin : badge Admin, Voir le site, Déconnexion
- [ ] Déconnexion redirige vers `/admin-hub/login`
- [ ] Pas de header/footer du site public sur les pages admin

### Auth Supabase
- [ ] Inscription avec email + mot de passe
- [ ] Email de vérification reçu
- [ ] Connexion après vérification
- [ ] Redirection vers `/account` après login
- [ ] Profil affiché avec nom + email + points de fidélité
- [ ] Déconnexion fonctionnelle
- [ ] Protection des routes `/account` (redirect vers login)
- [ ] Redirect `/auth/login` vers `/account` si déjà connecté

### Panier
- [ ] Ajout de produit au panier (invité)
- [ ] Persistance après refresh (localStorage)
- [ ] Modification de quantité
- [ ] Suppression d'article
- [ ] Badge header se met à jour
- [ ] Sync panier au login (merge local + remote)
- [ ] Panier vidé après paiement réussi

### Checkout + Stripe
- [ ] Formulaire pré-rempli si connecté (nom, email, téléphone)
- [ ] Toggle Livraison / Ramassage en magasin
- [ ] Livraison : formulaire adresse + provinces canadiennes
- [ ] Ramassage : grille créneaux (7 slots)
- [ ] Validation formulaire (champs requis, email, téléphone)
- [ ] Livraison gratuite au-dessus de 75$
- [ ] Validation Zod côté serveur
- [ ] Redirection vers Stripe Checkout
- [ ] Carte test 4242 4242 4242 4242 fonctionne
- [ ] Webhook crée `orders` + `order_items` dans Supabase
- [ ] Idempotence : double webhook ne crée pas de doublon
- [ ] Cart converti en `converted` après paiement
- [ ] Points de fidélité attribués (1 point / dollar)
- [ ] Page `/success` affiche récapitulatif + lien Mon compte
- [ ] Page `/cancel` affiche message + lien retour

### Catalogue (Sanity)
- [ ] Produits affichés depuis Sanity (ou mock data)
- [ ] Filtrage par catégorie
- [ ] Recherche par nom
- [ ] Fiche produit avec images, prix, description
- [ ] Best-sellers sur la page d'accueil (8 produits)
- [ ] Catégories dynamiques (BentoGrid avec images Sanity)

### Cal.com
- [ ] Page `/appointments` affiche l'embed Cal.com
- [ ] Fallback si `CALCOM_EMBED_URL` non configuré

### Pages légales
- [ ] `/legal/terms` : CGV complètes
- [ ] `/legal/privacy` : Politique de confidentialité
- [ ] `/legal/refunds` : Politique de retour
- [ ] `/legal/imprint` : Mentions légales

### SEO
- [ ] `/robots.txt` accessible et correct (auth/account/api bloqués)
- [ ] `/sitemap.xml` liste toutes les pages + produits
- [ ] Meta OG dans le `<head>`
- [ ] Chaque page a un `<title>` unique

### Responsive
- [ ] Mobile : menu hamburger, grille 2 colonnes, formulaire adapté
- [ ] Desktop : navigation, grille 4 colonnes, sidebar checkout

### Sécurité
- [ ] Headers HTTP : CSP, HSTS, X-Frame-Options présents (vérifier avec securityheaders.com)
- [ ] `X-Powered-By` absent des réponses
- [ ] Prix vérifiés côté serveur au checkout (modifier un prix dans le panier ne doit pas fonctionner)
- [ ] Un utilisateur normal ne peut pas modifier son `role` dans `profiles`
- [ ] `increment_loyalty` non appelable directement par un utilisateur
- [ ] Redirections auth : impossible de rediriger vers un site externe
- [ ] Pages admin non indexées par Google (`robots: noindex`)

### Docker
- [ ] `docker-compose up --build` sans erreur
- [ ] App accessible sur port 3000
- [ ] Variables d'environnement Supabase + Stripe correctement passées

## Guide de deploiement client

Un guide PDF complet est disponible pour configurer le site pour un nouveau client :

**[GUIDE_DEPLOIEMENT.pdf](GUIDE_DEPLOIEMENT.pdf)** — 14 sections couvrant :
- Configuration de chaque service (Sanity, Supabase, Stripe, Cal.com)
- Alimentation du catalogue (categories, produits, images)
- Tests fonctionnels (checklists completes)
- Deploiement en production (Vercel, domaine, SSL)
- Personnalisation pour un nouveau client
- Depannage (FAQ)

### Regenerer le PDF

Si le guide markdown (`GUIDE_DEPLOIEMENT.md`) a ete modifie :

```bash
npx md-to-pdf GUIDE_DEPLOIEMENT.md
```

## Licence

Projet prive.
