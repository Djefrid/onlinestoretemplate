# Épicerie Africaine

E-commerce de produits africains authentiques (épices, produits frais, soins naturels) avec livraison et retrait en magasin.

## Stack technique

| Couche        | Technologie                            |
|---------------|----------------------------------------|
| Frontend      | Next.js 14 (App Router, TypeScript)    |
| Styles        | Tailwind CSS                           |
| CMS           | Sanity.io v3                           |
| Paiement      | Stripe Checkout                        |
| Rendez-vous   | Cal.com (embed)                        |
| Panier        | Zustand + localStorage                 |
| Déploiement   | Docker + docker-compose (Coolify/VPS)  |

## Structure du projet

```
my-shop/
├── apps/
│   ├── web/              # Next.js 14 (frontend + API)
│   │   ├── app/          # Routes (App Router)
│   │   ├── components/   # Composants React
│   │   ├── lib/          # Utilitaires, Sanity, Stripe, cart
│   │   ├── hooks/        # Custom hooks
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # CSS global
│   └── studio/           # Sanity Studio v3
├── seed/                 # Script de seed Sanity
├── docker-compose.yml
└── README.md
```

## Routes

| Route                  | Type      | Description                          |
|------------------------|-----------|--------------------------------------|
| `/`                    | Static    | Accueil (Hero, catégories, best-sellers) |
| `/shop`                | Dynamic   | Catalogue avec filtres et recherche  |
| `/product/[slug]`      | Dynamic   | Fiche produit détaillée              |
| `/cart`                | Static    | Panier (quantités, totaux)           |
| `/checkout`            | Static    | Formulaire commande (livraison/ramassage) |
| `/success`             | Dynamic   | Confirmation après paiement          |
| `/cancel`              | Static    | Annulation paiement                  |
| `/appointments`        | Static    | Prise de rendez-vous (Cal.com)       |
| `/legal/terms`         | Static    | CGV                                  |
| `/legal/privacy`       | Static    | Politique de confidentialité         |
| `/legal/refunds`       | Static    | Politique de retour                  |
| `/legal/imprint`       | Static    | Mentions légales                     |
| `/api/checkout`        | API       | Création session Stripe              |
| `/api/webhook/stripe`  | API       | Webhook Stripe (commandes)           |
| `/sitemap.xml`         | SEO       | Sitemap dynamique                    |
| `/robots.txt`          | SEO       | Robots.txt                           |

## Installation

### Prérequis

- Node.js 20+
- npm 10+

### Setup

```bash
# Cloner le repo
git clone <repo-url> && cd my-shop

# Installer les dépendances
cd apps/web && npm install
cd ../studio && npm install

# Copier les variables d'environnement
cp apps/web/.env.example apps/web/.env.local

# Lancer le dev
cd apps/web && npx next dev -p 3007
```

L'app fonctionne sans Sanity ni Stripe grâce au système de mock data.

### Variables d'environnement

Voir `apps/web/.env.example` pour la liste complète.

| Variable | Requise | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Non* | ID projet Sanity |
| `SANITY_API_TOKEN` | Non* | Token écriture Sanity (webhook) |
| `STRIPE_SECRET_KEY` | Non* | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Non* | Secret du webhook Stripe |
| `NEXT_PUBLIC_BASE_URL` | Oui | URL publique du site |
| `NEXT_PUBLIC_CALCOM_EMBED_URL` | Non | Lien Cal.com pour rendez-vous |

*L'app démarre sans ces variables grâce aux fallbacks mock.

## Stripe (test local)

```bash
# Installer Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:3007/api/webhook/stripe

# Copier le whsec_... dans .env.local → STRIPE_WEBHOOK_SECRET

# Carte de test
# 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123
```

## Sanity Studio

```bash
cd apps/studio
npx sanity dev

# Seed des données
cd ../../seed
node seed-sanity.mjs
```

## Docker

```bash
# Build et lancer
docker-compose up --build -d

# L'app est accessible sur http://localhost:3000
```

Le Dockerfile utilise le mode `standalone` de Next.js pour une image optimisée (~150 MB).

Compatible Coolify : pointer le docker-compose.yml et configurer les variables d'environnement dans l'interface.

## Checklist tests manuels

### Pages publiques
- [ ] Accueil : Hero, bento catégories, best-sellers (8 produits)
- [ ] `/shop` : grille produits, filtres (catégorie, tags, prix, recherche, tri)
- [ ] `/product/[slug]` : fiche complète, sélecteur quantité, bouton ajouter
- [ ] `/appointments` : fallback ou embed Cal.com

### Panier & Checkout
- [ ] Ajouter un produit au panier (badge header se met à jour)
- [ ] `/cart` : modifier quantité, supprimer, vider le panier
- [ ] `/cart` : sous-total, livraison (gratuite > 75$), total correct
- [ ] `/checkout` : toggle Livraison / Ramassage en magasin
- [ ] Livraison : formulaire adresse + provinces canadiennes
- [ ] Ramassage : grille créneaux (7 slots)
- [ ] Validation formulaire (champs requis, email, téléphone)
- [ ] Clic "Payer avec Stripe" → appel API → redirection Stripe (ou erreur si pas de clé)

### Stripe
- [ ] Paiement test (4242...) → redirection `/success`
- [ ] Annulation → redirection `/cancel`
- [ ] Webhook reçu (`stripe listen`) → commande créée dans Sanity
- [ ] Page `/success` : récapitulatif commande, mode livraison/ramassage

### Pages légales
- [ ] `/legal/terms` : CGV complètes
- [ ] `/legal/privacy` : Politique de confidentialité
- [ ] `/legal/refunds` : Politique de retour
- [ ] `/legal/imprint` : Mentions légales

### SEO
- [ ] `/sitemap.xml` : toutes les pages listées
- [ ] `/robots.txt` : API/cart/checkout bloqués

### Responsive
- [ ] Mobile : menu hamburger, grille 2 colonnes, formulaire adapté
- [ ] Desktop : navigation, grille 4 colonnes, sidebar checkout

### Docker
- [ ] `docker-compose up --build` sans erreur
- [ ] App accessible sur port 3000
