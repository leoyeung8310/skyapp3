#Pre-installation: (Requirement for any NodeJS + AngularJS + MongoDB application)
Install nodejs,

`nvm --version` → check installation success

Install angular cli

`npm install -g @angular/cli` [make sure you have 'sudo -s']

`ng --version` → check installation

Run Web App locally

`ng serve`

see webpage in http:localhost:4200

Install development tool for editing (optional)

WebStorm or Visual Code

#Run and install MongoDB on MacOS:
Install brew: (https://brew.sh/)

/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

`brew update`

Install mongoDB by brew: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

`brew install mongodb`

Create the data directory, where leo = (your username):

`sudo mkdir -p /data/db`

`sudo chown -R leo /data/db`

Run MongoDB in 1st terminal:
`mongod`

#Installation of SkyApp 3:
Install JS Frameworks

`cd skyapp`

`npm install → install required frameworks based on “package.json”`

#To run local with MongoDB:
When MongoDB is running in your machine, you can run command to run the app in 2nd terminal:

`npm run local`

#Account and Password
1) Passport’s secret key: "(input secret here)"         
(You may use/edit the key of "secret" in app_api/config/database.js)

2) User creation key: "(input passcode here)"
(You may use/edit the key of "code" in app_api/config/database.js)

#Transfer source code to other machine:
compress without ‘package-lock.json’ and the folder ‘node_module’, de-compress in other machine

`npm install`

#Other comments from Leo about SkyApp

This is a base project under structure of MEAN (with Angular 4), Bootstrap 4 with free [SBAdmin4 template](https://github.com/start-angular/SB-Admin-BS4-Angular-4) and SocketIO (Will be released in SkyApp 3.1), latest real-time web app setup approach in 2017. 

##Client-side Info:

**Angular 4** is installed and preferred, thus **typescript** is used. **HTML5** is suggested to handles UI, **sass/scss** handles style, while **CSS** can also be directly imported. Angular App's folder may refer to `src`. Highly recommended to use Angular CLI instead of manual creation to make component or etc.    

##Server-side Info:

**Mongoose** is setup. **API** server setup is stored in folder `app_api`.  

##Socket IO Chat Example:

**SocketIO** [example](https://www.djamware.com/post/58e0d15280aca75cdc948e4e/building-chat-application-using-mean-stack-angular-4-and-socketio) refer to 
* `server.js`
* `app_api\models\chat.js`
* `app_api\routes\chat.js`
* `src\app\login`.  

Chat example's real-time property has been tested that works normally in intranet and deployed in heroku server. Major chat function will be released in SkyApp 3.1.

##(Important) Install nodemodules

**One-time command** : Run `npm install`.

##Build and run App in Local:

First, in terminal 1, Run `mongod` to execute mongod, wait for connection. This app will connect to the database "skyapp". Keep the terminal's process.

Second, in terminal 2, Run `npm run local` to build and run app in localhost, detail of this command can refer to the file of package.json.  

if you only want to modify client-side UI without connection of DB, you may use `ng serve`. 

##Build and Run App in Heroku:

Make sure you have **Git**, **Heroku CLI** installed properly. Connection to **Heroku** (e.g. by `heroku create`) has been done in your project. External MongoDB (e.g. MongoLab) is connected, [for example](https://devcenter.heroku.com/articles/mongolab). This app requires the environment variable `process.env.MONGODB_URI`. 

Run `npm run deployToHeroku` to build and run app in Heroku, detail of this command can refer to the file of package.json. 

## Further help

Just find and ask Leo :)

# Skyapp - Comments generated from Angular CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Server-side API development
Run `nodemon server.js` and test by software 'Postman'. 

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## References
Node, Express, Mongoose and Passport.js REST API Authentication (https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication)
