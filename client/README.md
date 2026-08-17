# MindHarbor — Client

Interface React + TypeScript de la plateforme ECMMindHarbor.

## Vue d’ensemble

Le client fournit l’interface utilisateur de l’application : connexion, inscription, tableau de bord, journal, analyse, ressources, groupes, profil et administration.

## Prérequis

- Node.js 20+
- npm
- Backend démarré sur http://localhost:3000

## Installation rapide

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Variables d’environnement

Le fichier `.env` doit contenir :

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run typecheck
```

## Structure du code

```text
client/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Fonctionnalités couvertes

- Authentification (connexion / inscription)
- Tableau de bord personnel
- Journal de bien-être
- Analyse et tendances
- Ressources et favoris
- Groupes de soutien
- Profil utilisateur
- Administration de base

## Points d’intégration

- Les appels API sont centralisés dans `src/api/`.
- L’intercepteur Axios injecte le token d’accès.
- La gestion de session repose sur le contexte d’authentification.
- Les routes protégées passent par `ProtectedRoute` et `AdminRoute`.
- L’interface est pensée pour une navigation fluide sur desktop et mobile.

## Comptes de démonstration

Les comptes de démonstration sont créés par le backend via le seed Prisma :

| Rôle           | Courriel               | Mot de passe    |
| -------------- | ---------------------- | --------------- |
| Administrateur | admin@ecmmind.com      | AdminTest-2026! |
| Modérateur     | moderateur@ecmmind.com | ModTest-2026!   |
| Utilisateur    | user1@test.com         | User1Test-2026! |
| Utilisateur    | user2@test.com         | User2Test-2026! |

## Vérifications avant remise

- `npm run typecheck` passe sans erreur.
- `VITE_API_URL` est bien défini.
- Aucun appel `fetch` n’est utilisé directement.
- Aucune URL API n’est écrite en dur dans les composants.
- L’application démarre sur le port 5173 lorsque le backend est actif.

## Limitations connues

- Les éléments de messagerie et d’administration avancée sont encore partiels.
- Certaines pages sont fonctionnelles mais leur logique continue d’évoluer selon les retours de validation.

---

Documentation du frontend du projet ECMMindHarbor.
