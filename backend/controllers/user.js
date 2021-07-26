const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidator = require('./password');



//fct signup qui va crypter password, va cree un nouveau user avec ce password et l email, et l'enregistre
exports.signup = (req, res, next) => {
  if (userValidator.isGoodPassword(req.body.password)) {
  bcrypt.hash(req.body.password, 10) //function hashage de bcrypt, on sale 10 fois le password
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }else{
    return res.status(404).json({ message: 'Le mot de passe doit contenir au moins un nombre, une minuscule, une majuscule et être composé de 6 caractères minimum !' });
  }

};


exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })//Verifie si email est ds la bdd
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)//compare password user et bdd et renvoit id token si ok
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(//fct de jasonwebtoken: pour encoder un nouveau token
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',//chaîne secrète de développement temporaire pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
              { expiresIn: '24h' }//duree de validite
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
