const Sauce = require('../models/Sauce');
const fs = require('fs');//pachage fs de node: nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //on convertit en chaine pour obtenir un objet utilisable
  delete sauceObject._id;//car le frontend genere un id, inutile car on va en avoir un genere par mongodb
  //Creation d une instance de sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes:0,
    dislikes:0,
    usersLiked:[],
    usersDisliked:[]
  });
  sauce.save()//enregistre dans bdd
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce=(req, res, next)=>{
  Sauce.findOne({_id :req.params.id})//pour trouver la sauce ayant le meme id que params de requete
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({error:error})
  );
};
// on crée un objet sauceObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?//y a t il une nouvelle image?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//mettre à jour le Sauce qui correspond à l'objet que nous passons comme premier argument
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//on utilise l'ID que nous recevons comme paramètre pour accéder au Sauce correspondant dans la bdd
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {//nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ; Unlike va nous permettre de la supprimer
        Sauce.deleteOne({ _id: req.params.id })//dans ce callback on supprime le Sauce de la bdd, nous lui passons un objet correspondant au document à supprimer
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) =>{
  Sauce.find()//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les Sauces dans notre base de données.
  .then((sauces)=> res.status(200).json(sauces))
  .catch((error) => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) =>{
  if(req.body.like ==1){//si user a like
    Sauce.updateOne({_id: req.params.id}, {$inc:{likes:1}, $push:{usersLiked:req.body.userId },_id:req.params.id } )//c est l id qu on va modifie
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  }else if(req.body.like ==-1){//si user a dislike
    Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes:1}, $push:{usersDisliked:req.body.userId },_id:req.params.id } )
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  }else if(req.body.like ==0){
    Sauce.findOne({_id: req.params.id})
    .then(sauces=> {
      if(sauces.usersLiked.find(user=> user===req.body.userId)){//si il avait like
        Sauce.updateOne({_id: req.params.id}, {$inc:{likes:-1}, $pull:{usersLiked:req.body.userId },_id:req.params.id } )
        .then(sauces=> res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
      }
      if(sauces.usersDisliked.find(user=> user===req.body.userId)){//si il avait dislike
        Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes:-1}, $pull:{usersDisliked:req.body.userId },_id:req.params.id } )
        .then(sauces=> res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
      }
    })
    .catch(error=>console.log(error));
  }
}
