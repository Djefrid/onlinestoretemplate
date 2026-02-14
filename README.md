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
│   │   ├── components/    # Composants UI + layout
│   │   ├── lib/           # Clients (Sanity, Supabase, Stripe), utils
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # CSS global
│   └── studio/            # Sanity Studio v3
├── supabase/
│   └── migrations/        # SQL (tables, RLS, indexes, RPC)
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
#   supabase/migrations/001_init.sql
#   supabase/migrations/002_rls_policies.sql
#   supabase/migrations/003_indexes.sql
#   supabase/migrations/004_loyalty_rpc.sql

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
| `profiles` | Profils utilisateur (auto-créé au signup via trigger) |
| `carts` | Paniers persistants (statut: `active` / `converted`) |
| `cart_items` | Articles du panier |
| `orders` | Commandes (créées par le webhook Stripe) |
| `order_items` | Articles de commande |
| `reviews` | Avis produit (1 par user par produit) |

### RLS (Row Level Security)

Toutes les tables ont RLS activé :
- **profiles** : lecture/modification de son propre profil
- **carts/cart_items** : CRUD sur ses propres paniers
- **orders/order_items** : lecture de ses propres commandes
- **reviews** : lecture publique, CRUD sur ses propres avis

Le webhook utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS.

### Migrations

```
supabase/migrations/
├── 001_init.sql           # Tables, enums, trigger handle_new_user
├── 002_rls_policies.sql   # 14 RLS policies
├── 003_indexes.sql        # 7 indexes de performance
└── 004_loyalty_rpc.sql    # Fonction increment_loyalty
```

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
| `/api/checkout` | API | Crée une session Stripe |
| `/api/webhook/stripe` | API | Webhook Stripe (commandes) |
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
