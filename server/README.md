# MindHarbor — Backend

API Express + TypeScript du projet ECMMindHarbor.

## Vue d’ensemble

Le backend fournit les endpoints REST pour l’authentification, le journal, les ressources, les groupes, les publications, le tableau de bord et l’administration.

## Prérequis

- Node.js 20+
- npm
- Une base PostgreSQL accessible via Prisma
- Une clé JWT sécurisée

## Installation rapide

```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Le serveur démarre normalement sur :

- http://localhost:3000
- endpoint de santé : http://localhost:3000/api/v1/health

## Variables d’environnement

Le fichiers `.env` doit contenir :

```env
DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require"
JWT_ACCESS_SECRET="remplace-ca-par-une-vraie-cle-secrete-en-local"
JWT_REFRESH_SECRET="remplace-ca-par-une-autre-cle-secrete"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL="7d"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run seed
```

## Structure principale

```text
server/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── schemas/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── generated/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Modèles de données

Le schéma Prisma couvre les éléments suivants :

- utilisateur et rôles
- journal de bien-être
- activités associées
- ressources et favoris
- groupes et adhésions
- publications et commentaires
- messages
- signalements
- tokens de rafraîchissement

## Comptes de démonstration

Le seed crée 4 comptes utiles pour le test de l’application :

| Rôle           | Courriel               | Mot de passe    |
| -------------- | ---------------------- | --------------- |
| Administrateur | admin@ecmmind.com      | AdminTest-2026! |
| Modérateur     | moderateur@ecmmind.com | ModTest-2026!   |
| Utilisateur    | user1@test.com         | User1Test-2026! |
| Utilisateur    | user2@test.com         | User2Test-2026! |

## Vérifications avant remise

- `npx prisma generate` fonctionne.
- `npx tsc --noEmit` passe sans erreur.
- le seed charge bien les comptes de démonstration.
- `DATABASE_URL` et les secrets JWT sont configurés localement sans être versionnés.

## Limites connues

- Les flux de messagerie et d’administration avancée sont encore partiels.
- Les règles de sécurisation et le niveau de validation doivent être confirmés lors d’une passe finale de recette.

---

Documentation du backend du projet ECMMindHarbor.
