# FADIMA — Gestion simple pour les petits business africains

> Ton business. Ta voix. Tes chiffres.

FADIMA est un copilote numérique destiné aux petits commerçants et micro-entrepreneurs africains. Gérez vos ventes, dépenses, dettes et stocks simplement depuis votre téléphone.

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit sur [supabase.com](https://supabase.com))

### Installation locale

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd fadima-app

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration Supabase

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Choisir une région proche (Europe de l'Ouest recommandé)

### 2. Configurer la base de données

1. Dans votre projet Supabase, aller dans **SQL Editor**
2. Copier le contenu de `supabase/migrations/001_initial_schema.sql`
3. Exécuter le script
4. Copier `supabase/migrations/002_seed_demo.sql` pour les données de démo
5. Exécuter le script seed

### 3. Configurer l'authentification

1. Dans **Authentication > Settings**
2. Activer "Email auth" (activé par défaut)
3. Configurer l'URL de redirection : `http://localhost:3000/auth/callback`
4. Pour la production : `https://votre-domaine.com/auth/callback`

### 4. Récupérer les clés API

Dans **Settings > API** :
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔑 Variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
```

---

## 📦 Déploiement sur Vercel

### Option 1 : Via GitHub (recommandé)

1. Pousser le code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Importer le dépôt GitHub
4. Ajouter les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Déployer

### Option 2 : Via CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Configuration Supabase pour la production

Dans Supabase → **Authentication > URL Configuration** :
- Site URL : `https://votre-app.vercel.app`
- Redirect URLs : `https://votre-app.vercel.app/auth/callback`

---

## 📁 Structure du projet

```
fadima-app/
├── app/
│   ├── (auth)/          # Pages authentification
│   ├── (dashboard)/     # Pages protégées (dashboard)
│   ├── (marketing)/     # Landing page publique
│   └── layout.tsx
├── components/
│   ├── ui/              # Composants réutilisables
│   ├── dashboard/       # Composants du tableau de bord
│   ├── forms/           # Formulaires
│   └── layout/          # Navigation, sidebar
├── lib/
│   ├── supabase/        # Client Supabase
│   ├── hooks/           # React hooks
│   ├── utils/           # Utilitaires
│   └── parser/          # Parser mode conversationnel
├── types/               # Types TypeScript
└── supabase/
    └── migrations/      # SQL migrations
```

---

## 🎯 Fonctionnalités MVP

- ✅ Authentification (inscription/connexion)
- ✅ Dashboard avec KPIs temps réel
- ✅ Gestion des ventes
- ✅ Gestion des dépenses
- ✅ Gestion des dettes clients
- ✅ Gestion des produits et stocks
- ✅ Gestion des clients
- ✅ Statistiques et graphiques
- ✅ Assistant intelligent (parser local)
- ✅ Mode "Écrire simplement"
- ✅ PWA (ajout à l'écran d'accueil)
- ✅ Mode démo (Mariam Fashion)
- ✅ Responsive mobile-first

---

## 🌍 Expansion future

L'architecture est préparée pour :
- WhatsApp Business API
- Mobile Money (MTN, Orange, Moov)
- IA avancée (Gemini/OpenAI)
- Notifications push
- Application Android/iOS native
- Multi-pays (Sénégal, Côte d'Ivoire)
- Multi-utilisateurs par business

---

## 📄 Licence

Propriétaire — FADIMA © 2024
