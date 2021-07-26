const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const xss = require ('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');//accede au path du serveur
const sauceRoutes = require('./routes/sauce'); //router 
const userRoutes = require('./routes/user');//accede aux users
const toobusy = require('toobusy-js');

mongoose.connect('',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //'accéder à notre API depuis n'importe quelle origine ( '*' ) 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//envoyer des requêtes avec les méthodes mentionnées ( GET, POST, PUT, DELETE, PATCH, OPTIONS)
  next();
});

app.use(bodyParser.json());+

app.use(mongoSanitize());    // Protection contre les injections dans Mongo Db
app.use('/images', express.static(path.join(__dirname, 'images')));//indique a express qu il faut gerer la ressource de maniere statiqueun sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/api/sauces', sauceRoutes); //importes toutes les routes pour toutes demande effectues, evite repetition 
app.use('/api/auth', userRoutes); //racine de tout ce qui est lie a l authentif, evite repetition 


app.use(helmet()); // protection contre injection sql et xss
// ...is equivalent to this:
// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
//determines if a page can be loaded via a <frame> or an <iframe> element. Allowing the page to be framed may result in Clickjacking attacks. 
//app.use(helmet.xframe());

//This header prevents Internet Explorer from executing downloaded files in the site's context. This is achieved with noopen directive.
app.use(helmet.ieNoOpen());
//This setting denies all such <iframe> content.Clickjacking is an ingenious technique for hiding an invisible <iframe> containing malicious code, but positioned on top of a thing that looks enticing to click on. The user would then be enticed into clicking on the malicious button.
app.use(helmet.frameguard({ action: 'deny' }));

//Nettoye les entrees user
app.use(xss());
//protection contre attaque DoS
toobusy.maxLag(10);
app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  } 
});
//ne retourne que ce qui est demande dans un champ(si besoin que du nom ne retournera pas email etc..)
exports.sanitizeUser = function(user) {
return {
  id: user.id,
  username: user.username,
  fullName: user.fullName
  };
};

module.exports = app;
