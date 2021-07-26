const express = require('express');
const router = express.Router();//remplace app.post dans les routes par router.post
const userCtrl = require('../controllers/user');
const password =require('../middleware/password');
const rateLimit = require("express-rate-limit");
//10 possibilite de se connecter, toutes les 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limite de 10 tentatives
  message:
    "Too many accounts created from this IP, please try again after an hour"
});
//  apply to all requests



router.post('/signup',password, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);
module.exports = router;
