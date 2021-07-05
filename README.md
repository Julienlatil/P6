# P6

SoPekocko - Application Piquante
================================
LATIL JULIEN
05/07/2021


Présentation du projet 
----------------------
Ce projet est réalisé dans le cadre d'une formation de développeur web.

### Contexte : 
La société So Pekocko crée des sauces à base de piment. L'entreprise est en pleine essor grâce
à sa chaine Youtube et souhaite développer une application "Piquante" permettant aux utilisateurs d'ajouter
leurs sauces favorites et de donner un avis sur les sauces des autres utilisateurs.

Installation du backend 
-----------------------
1. Cloner le repository
2. Initialisation du projet : `npm init`
3. Lancer le serveur : `node server`
4. Package à installer avec `npm install` :
    * express
    * body-parser
    * fs
    * bcrypt
    * jsonwebtoken
    * multer
    * mongoose
    * mongoose-unique-validator
    * path
    * helmet
    * http

Installation du frontend 
-----------------------

Pour faire fonctionner le projet, vous devez installer :
- [NodeJS](https://nodejs.org/en/download/) en version 12.14 ou 14.0 
- [Angular CLI](https://github.com/angular/angular-cli) en version 7.0.2.
- [node-sass](https://www.npmjs.com/package/node-sass) : attention à prendre la version correspondante à NodeJS. Pour Node 14.0 par exemple, installer node-sass en version 4.14+.

Sur Windows, ces installations nécessitent d'utiliser PowerShell en tant qu'administrateur.

## Development server

Démarrer ng serve pour avoir accès au serveur de développement. Rendez-vous sur http://localhost:4200/. L'application va se recharger automatiquement si vous modifiez un fichier source.
