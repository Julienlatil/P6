const multer = require('multer');
//genere l extension du fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  "image/webp": "webp",
  "image/gif": "gif"
};
//indique a multer ou enregistrer les images et comment les nommer:(remplace " " par _ et ajoute un timestamp dinon probleme niveau server)
//si on utilisait le nom d origine, probleme qwuand 2 fichiers on le meme nom
const storage = multer.diskStorage({//on enregistre sur le disk
  destination: (req, file, callback) => {
    callback(null, 'images');//null pour dire q u il n y a pas eu d erreur a ce niveau la
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); //single car fichier unique
