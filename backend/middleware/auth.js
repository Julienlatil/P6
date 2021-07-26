//Protege la route et check que user est identifie. 
//Potentiellement beaucoup de probleme, donc on utilise try/catch pour les exceptions des instructions executes
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//nous avons 2 elements Bearer et le code hash, on choisit le [1] , soit le hash qui vient apres l espace
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//verifie que token valide, que "RANDOM..." correspond a celle de login()
    const userId = decodedToken.userId;//decode l id qui est dans le token, on verifie avec une condition , s il y a un userid qu il match avec token
    if (req.body.userId && req.body.userId !== userId) {//on verifie qu il y a userid ds requete et s il est != du token on Throw, sinon next()
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
