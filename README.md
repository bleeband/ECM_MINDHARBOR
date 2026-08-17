# ECMMindHarbor

ECMMindHarbor est une application web de soutien en santé mentale conçue pour accompagner les utilisateurs dans leur bien-être quotidien, leur accès à des ressources utiles et leur participation à des communautés de soutien.

**Cours :** Service Web – Groupe 25604 – Session Été 2026  
**Équipe :** ECM  
**Membres :**

- Eva Bessette
- Charles Legault
- Marc-André Dufour

## Objectif du projet

MindHarbor permet à un utilisateur de :

- tenir un journal de bien-être quotidien ;
- analyser ses tendances de santé mentale ;
- consulter des ressources fiables et des ressources d’urgence ;
- rejoindre ou consulter des groupes de soutien ;
- gérer son profil et sa visibilité ;
- accéder à un tableau de bord personnel ;
- utiliser une interface d’administration pour des tâches de supervision.

## Stack technique

- Frontend : React + TypeScript + Vite
- Backend : Express + TypeScript
- Base de données : PostgreSQL via Prisma + Neon
- Authentification : JWT + refresh tokens
- Validation : Zod
- Sécurité : CORS, Helmet, mot de passe hashé avec bcrypt

## Structure du dépôt

```text
ECM_MINDHARBOR/
├── README.md
├── client/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── server/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── ...
```

## Prérequis

- Node.js 20+
- npm
- Une base PostgreSQL accessible via Prisma (Neon ou autre instance compatible)
- Git

## Démarrage rapide

### 1) Cloner le dépôt

```bash
git clone https://github.com/bleeband/ECM_MINDHARBOR.git
cd ECM_MINDHARBOR
```

### 2) Configurer le backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Le backend écoute normalement sur :

- http://localhost:3000
- endpoint de santé : http://localhost:3000/api/v1/health

### 3) Configurer le frontend

Dans un nouveau terminal :

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Le client est généralement accessible sur :

- http://localhost:5173

## Variables d’environnement

### Backend

Fichier : `server/.env`

```env
DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require"
JWT_ACCESS_SECRET="remplace-ca-par-une-vraie-cle-secrete-en-local"
JWT_REFRESH_SECRET="remplace-ca-par-une-autre-cle-secrete"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL="7d"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

### Frontend

Fichier : `client/.env`

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## Base de données

Pour initialiser la base Prisma :

```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
```

Le fichier `server/prisma/seed.ts` crée des comptes de démonstration utiles pour la vérification fonctionnelle.

## Comptes de démonstration

| Rôle           | Courriel               | Mot de passe    |
| -------------- | ---------------------- | --------------- |
| Administrateur | admin@ecmmind.com      | AdminTest-2026! |
| Modérateur     | moderateur@ecmmind.com | ModTest-2026!   |
| Utilisateur    | user1@test.com         | User1Test-2026! |
| Utilisateur    | user2@test.com         | User2Test-2026! |

## Scripts utiles

### Backend

```bash
cd server
npm run dev     # démarrage avec rechargement automatique
npm run build   # build TypeScript
npm run seed    # insertion des comptes et données de démonstration
```

### Frontend

```bash
cd client
npm run dev     # démarrage Vite
npm run build   # build production
npm run typecheck # validation TypeScript sans compilation
```

## Fonctionnalités implémentées

- Journal de bien-être avec données et activités
- Analyse et tendances
- Ressources et favoris
- Groupes de soutien
- Profil personnalisé
- Tableau de bord utilisateur
- Interface d’administration initiale

## Limites connues

- La messagerie n’est pas entièrement finalisée.
- L’interface d’administration est présente mais son workflow complet n’est pas finalisé.
- La route de groupes doit être vérifiée si l’on modifie la logique de `creatorId`.

## Bonnes pratiques

- Ne jamais versionner les fichiers `.env` locaux.
- Toujours conserver `CLIENT_URL` aligné avec le port Vite.
- Vérifier les variables Prisma avant chaque démarrage local.

## Références rapides

- Frontend : `client/`
- Backend : `server/`
- Schéma Prisma : `server/prisma/schema.prisma`
- Données de test : `server/prisma/seed.ts`

---

Projet développé dans le cadre du cours Service Web – Session Été 2026.
