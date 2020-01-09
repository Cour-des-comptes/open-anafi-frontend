# Open Anafi front

ce projet est le FrontEnd d'OpenAnafi, le code du BackEnd est présent sur le répertoire suivant.
## Description du projet:

Le projet a été séparé en deux parties distincts:

   * La première étant le projet actuelle, c'est le back-end de l'application: [ici](https://github.com/Cour-des-comptes/open-anafi-backend)
   * La deuxième étant disponible au lien suivant, c'est le front-end de l'application:  [ici](https://github.com/Cour-des-comptes/open-anafi-frontend)


### Description des composants
* **HomeComponent:** Il s’agit de la page d’accueil d’OpenAnafi. Il s’agit aussi du composant par défaut vers lequel l’application va rediriger l’utilisateur si une route tapée est inconnue, ou si l’utilisateur ne possède pas assez de droits pour accéder à une route.

* **LoginComponent:** Ce composant correspond à la page de connexion de l’application. L’utilisateur sera redirigé automatiquement vers cette dernière s’il ne possède pas de Token d’authentification.

* **CommentComponent:** Ce composant affiche les commentaires liés à l’élément passé en paramètre, et permettra de laisser un commentaire.

* **ProductionComponent:** Ce composant gère toute la partie production de rapports d’OpenAnafi. Il permet de générer des rapports, et d’accéder à la liste de ses rapports afin de pouvoir les télécharger.

* **CreationComponent:** Ce composant permet de gérer la liste des nomenclatures, trames et indicateurs. Chaque élément peut être édité individuellement, ou bien une liste d’indicateurs peut être importées depuis un fichier Excel.

* **DocumentationComponent:** Ce composant est assez similaire au composant de création dans sa présentation, mais il s’agit d’un composant qui ne permet que la lecture des informations concernant les différents éléments (nomenclatures, trames, indicateurs). Il ne permet pas l’édition et est donc accessible à tous les utilisateurs.

### Les différents services
Les services sont utilisés principalement pour accéder aux différentes API fournies par le backend. Mais d’autres services sont aussi utilisés pour gérer certaines tâches qui ne sont propres à aucun composant :
* **AuthenticationService:** Ce service permet d’envoyer les informations de connexion au backend, et s’occupe de la gestion du Token d’authentification reçu via un cookie. Il permet à n’importe quel composant de récupérer l’utilisateur courant ainsi que ses informations.

* **ExportService:**  Ce service très générique permet d’exporter n’importe quelle liste de données au format Excel, et de générer un téléchargement pour l’utilisateur.

* **CustomAlertService:** Ce service permet de gérer l’ensemble des notifications affichées aux utilisateurs. Il se charge aussi d’afficher automatiquement les erreurs renvoyées par l’API afin de ne pas gérer ces dernières dans les composants. Il peut être appelé par les composants pour afficher ponctuellement une notification d’information ou un avertissement.

## developpement avec npm

Dans le dossier angular il faut lancer la commande
```
npm install 
```

Dès que la commande est finie vous pouvez commencer à développer sur l'application.

```
npm run start
```

## Déploiement sur un serveur CentOs

### Création  du répertoire de déploiement

```bash

su deploy
cd /var/www/http/
mkdir angular

sudo chown -r deploy:deploy /var/www/
sudo chmod -r 755 /var/www/

```
### Configurer Apache:
```bash
cd /etc/httpd/conf.d/

touch frontend.conf

```
ATTENTION: Remplacer les valeurs génériques par les valeurs du serveur (SERVERNAME) 
frontend.conf :

```bash

<VirtualHost *:80>
    ServerName SERVERNAME
    DocumentRoot /var/www/html/angular

    <Directory /var/www/html/angular>
        AllowOverride All
        Require all granted
        
        RewriteEngine on

        # Don't rewrite files or directories
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]

        # Rewrite everything else to index.html to allow HTML5 state links
        RewriteRule ^ index.html [L]

    </Directory>

</VirtualHost>

```
