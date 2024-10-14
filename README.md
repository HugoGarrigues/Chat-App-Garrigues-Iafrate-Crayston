# Chat-App

Ce projet est développé dans le cadre de notre projet d'Ymmersion B3 Dev 24-25.

Il nous a été imposé de créer un site web de chat en temps réel pour apprendre et appliquer des technologies modernes comme Firebase, TypeScript, et SCSS. Le projet a évolué pour inclure des fonctionnalités avancées telles que la gestion des utilisateurs, des groupes de discussion et des messages privés.

## Description

Bienvenue sur **Chat-App**, une plateforme de messagerie en temps réel intuitive et réactive. Ce projet vise à fournir une solution de chat moderne avec une interface utilisateur élégante et fluide.

**Chat-App** permet aux utilisateurs de :
- Communiquer en temps réel au sein de groupes.
- Envoyer des messages privés.
- Créer et gérer des groupes de discussion.
- Voir la liste des utilisateurs en ligne et hors ligne.

Le système est conçu pour être évolutif et facile à utiliser, tout en exploitant les nombreuses fonctionnalités.

## Sommaire

- Description
- Fonctionnalités
- Installation
- Architecture
- Technologies
- Auteurs

## Fonctionnalités

- **Messages en temps réel** : Discutez avec vos amis et collègues en temps réel dans des groupes ou via des messages privés.
- **Gestion des groupes** : Créez, supprimez et gérez vos groupes de discussion.
- **Utilisateurs en ligne et hors ligne** : Visualisez en temps réel qui est en ligne ou hors ligne.
- **Notifications instantanées** : Recevez des notifications pour chaque nouveau message.
- **Création de groupe** : Invitez d'autres utilisateurs à rejoindre des groupes de discussion personnalisés.

## Installation

1. Clonez ce dépôt sur votre machine locale :

    ```bash
    git clone https://github.com/HugoGarrigues/Chat-App-Garrigues-Iafrate-Crayston.git
    ```

2. Accédez au répertoire du projet :

    ```bash
    cd Chat-App-Garrigues-Iafrate-Crayston
    ```

3. Installez les dépendances :

    ```bash
    npm install
    ```

4. Configurez Firebase :

    - Créez un projet sur **Firebase** et obtenez les informations de configuration.
    - Créez un fichier `environment.ts` dans le dossier `src/environments/` et ajoutez vos informations Firebase comme ceci :

    ```typescript
    export const environment = {
      production: false,
      firebaseConfig: {
        apiKey: "votre-api-key",
        authDomain: "votre-auth-domain",
        databaseURL: "votre-database-url",
        projectId: "votre-project-id",
        storageBucket: "votre-storage-bucket",
        messagingSenderId: "votre-messaging-sender-id",
        appId: "votre-app-id"
      }
    };
    ```

5. Lancez l'application :

    ```bash
    ng serve
    ```

## Technologies

**Frontend** :

- Angular
- TypeScript
- SCSS
- HTML
- Bootstrap

**Backend** :

- **Firebase** : Utilisé pour l'authentification, la base de données en temps réel (Firestore), et le stockage des fichiers.

## Auteurs

- **Hugo Garrigues** - [GitHub](https://github.com/HugoGarrigues)
- **Thomas Iafrate** - [GitHub](https://github.com/thomasiafrate1)
- **Matt Crayston** - [GitHub](https://github.com/MattCrayston24)

