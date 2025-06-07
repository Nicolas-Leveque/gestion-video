# Gestion Vidéo

Application de gestion de bibliothèque de films développée avec Electron et React.

## Description

Cette application permet de gérer une collection de films (DVD, Blu-ray, formats numériques) avec les fonctionnalités suivantes :
- Catalogage des films avec leurs informations (titre, année, réalisateur, etc.)
- Classement par catégories (genres)
- Gestion des différents formats (DVD, Blu-ray, numérique, etc.)
- Suivi des exemplaires physiques et numériques
- Interface visuelle avec affichage des affiches de films
- Recherche et filtrage avancés

## Structure du projet

- `docs/` : Documentation du projet
  - `tasks.md` : Liste des tâches à réaliser
  - `plan.md` : Plan détaillé du projet
- `src/` : Code source de l'application
  - `database/` : Couche d'accès aux données
    - `models/` : Modèles Sequelize
    - `dao/` : Objets d'accès aux données (DAO)
  - `ipc/` : Communication inter-processus Electron
  - `utils/` : Utilitaires pour l'application
  - `components/` : Composants React réutilisables
  - `pages/` : Pages React de l'application
- `public/` : Fichiers statiques
- `data/` : Dossier contenant la base de données SQLite (créé au premier lancement)

## Technologies utilisées

- **Frontend** : React, React Router
- **Backend** : Electron, Node.js
- **Base de données** : SQLite avec Sequelize
- **Autres** : TypeScript (optionnel)

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-utilisateur/gestion-video.git
cd gestion-video
```

2. Installer les dépendances :
```bash
npm install
```

3. Initialiser la base de données :
```bash
npm run setup-db
```

## Démarrage

Pour lancer l'application en mode développement :
```bash
npm run electron-dev
```

## Scripts disponibles

- `npm run electron-dev` : Lance l'application en mode développement
- `npm run start` : Lance Electron
- `npm run react-start` : Lance l'application React
- `npm run build` : Compile l'application React
- `npm run test` : Lance les tests
- `npm run setup-db` : Initialise la base de données

## Développement

Consultez les fichiers README.md dans les différents répertoires pour plus d'informations sur chaque partie du projet :
- [src/database/README.md](src/database/README.md) : Documentation de la couche d'accès aux données
- [src/utils/README.md](src/utils/README.md) : Documentation des utilitaires
- [src/ipc/README.md](src/ipc/README.md) : Documentation de la communication IPC

## Licence

MIT
