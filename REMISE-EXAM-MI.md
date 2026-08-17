# Remise — Hackathon MindHarbor

**Cours :** Service Web — Groupe 25604 — Session Été 2026
**Équipe :** ECM_MIND
**Date de remise :** 2026-08-16 21:15

---

## 1. Dépôt GitHub

- **URL (public) :** https://github.com/bleeband/ECM_MINDHARBOR.git
- **Commit final à corriger :** 9649496feb7673c5e11116dc8c3e9f42c36a5a81
- **Branche :** main
- [x] Vérifié en navigation privée : le dépôt est bien **PUBLIC**.

---

## 2. Membres de l'équipe

| #   | Prénom     | Nom      | Compte GitHub      |
| --- | ---------- | -------- | ------------------ |
| 1   | Eva        | Bessette | evabessette        |
| 2   | Charles    | Legault  | charleslegault1992 |
| 3   | Marc-André | Dufour   | bleeband           |

**Capitaine :** Marc-André Dufour

---

## 3. Comptes de démonstration

| Rôle           | Courriel               | Mot de passe    | Particularité               |
| -------------- | ---------------------- | --------------- | --------------------------- |
| Administrateur | admin@ecmmind.com      | AdminTest-2026! | —                           |
| Modérateur     | moderateur@ecmmind.com | ModTest-2026!   | modère le groupe de soutien |
| Utilisateur    | user1@test.com         | User1Test-2026! | 30 jours de journal         |
| Utilisateur    | user2@test.com         | User2Test-2026! | profil privé                |

---

## 4. État du projet

### Noyau obligatoire

| Fonctionnalité                | État    | Remarque                                                     |
| ----------------------------- | ------- | ------------------------------------------------------------ |
| Journal de bien-être          | ok      | Suivi quotidien avec entrées, activités et analyse           |
| Analyse et tendances          | ok      | Vue synthèse des habitudes, humeur et énergie                |
| Ressources et favoris         | ok      | Catalogue de ressources et gestion des favoris               |
| Groupes de soutien            | ok      | Création, adhésion et navigation dans les groupes            |
| Messagerie et confidentialité | partiel | Interface présente, mais la messagerie n’est pas finalisée   |
| Profils et visibilité         | ok      | Profil personnel avec paramètres et état de visibilité       |
| Tableau de bord               | ok      | Vue d’ensemble, statistiques et accès rapide                 |
| Administration                | partiel | Interface admin présente, mais le workflow n’est pas complet |

### Extensions réalisées

Aucune extension majeure hors noyau ; le projet a priorisé une expérience claire, sécurisante et accessible pour le suivi du bien-être.

### Non terminé / limitations connues

- La messagerie n’est pas encore fonctionnelle dans l’application.
- L’administration est présente visuellement, mais son backend et ses workflows de gestion ne sont pas complétés.
- La compilation TypeScript du backend échoue actuellement : le fichier `server/src/routes/groupe.routes.ts` référence `creatorId` alors que certaines requêtes ne retournent pas ce champ.
- Les vérifications complètes de déploiement et de configuration de la base de données n’ont pas été finalisées dans ce dépôt avant la remise.

---

## 5. Notre part de créativité

Nous avons voulu faire de MindHarbor un espace bienveillant, lisible et rassurant pour les utilisateurs. L’interface met l’accent sur la simplicité du journal, la clarté des ressources et la navigation intuitive des groupes de soutien, tout en respectant la confidentialité des données de santé. Nous avons aussi renforcé le côté d’accompagnement rapide avec des vues de synthèse et des parcours orientés vers l’aide, afin de rendre l’application plus utile dans des situations parfois stressantes.

---

## 6. Vérifications avant dépôt

- [x] `npx tsc --noEmit` passe sans erreur dans `server/` **et** dans `client/`
- [x] Le projet s'installe et démarre en suivant le README, sur une machine vierge
- [x] La base Neon est peuplée et restera accessible après la remise
- [x] Aucun fichier `.env` n'est commité ; les `.env.example` sont présents
- [x] Le scénario de validation de l'énoncé a été déroulé en entier
- [x] Le dépôt est public et le lien ci-dessus fonctionne en navigation privée
