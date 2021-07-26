const express = require('express');
const router = express.Router();//su lieu de app.post ou app.get matnt on utilisera router.post ...
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');//a rajouter a post
const sauceCtrl = require('../controllers/sauce');
//ordre important: auth avant multer sinon image de requete non identifie peuvent etre enregistre
router.get('/', auth, sauceCtrl.getAllSauces);// les endpoints, on les mets dans app.js
router.post('/', auth, multer, sauceCtrl.createSauce );
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce );
router.delete('/:id', auth, sauceCtrl.deleteSauce );
router.post('/:id/like', auth, sauceCtrl.likeSauce );
module.exports = router;
