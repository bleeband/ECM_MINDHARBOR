# MindHarbor — Client

Interface React + TypeScript du projet MindHarbor.

## Pré-requis

- Node.js 20+
- npm
- Le backend démarré sur `http://localhost:3000/api/v1` par défaut

## Installation

```bash
cd client
npm install
cp .env.example .env
```

## Variables d'environnement

- `VITE_API_URL` : URL de base de l'API Express.

Exemple :

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
```

## Fonctionnalités couvertes

- Connexion et inscription.
- Tableau de bord personnel.
- Journal quotidien avec historique.
- Tendances avec graphique.
- Ressources avec recherche et favoris.
- Groupes de soutien.
- Messagerie privée.
- Profil.
- Administration de base.

## Organisation

- `src/api/` : toutes les requêtes Axios.
- `src/context/` : contexte d'authentification.
- `src/components/` : composants réutilisables.
- `src/pages/` : pages de l'application.
- `src/types.ts` : types partagés côté client.

## Choix techniques

- `Axios` est centralisé dans `src/api/axios.ts`.
- Le token d'accès est injecté automatiquement par intercepteur.
- Une réponse `401` tente un refresh automatique.
- Les routes privées sont protégées avec `ProtectedRoute` et `AdminRoute`.
- L'interface est responsive et pensée pour une largeur mobile de 375px.

## Notes d'intégration

Le client suppose que le backend expose les routes prévues dans l'énoncé, sous le préfixe `/api/v1`.

## Comptes de démonstration

À compléter avec les comptes seedés du backend.

## Points à vérifier avant remise

- `npm run typecheck` passe sans erreur.
- `VITE_API_URL` est bien défini.
- Aucun appel `fetch` n'est utilisé.
- Aucune URL API n'est écrite en dur dans les composants.
