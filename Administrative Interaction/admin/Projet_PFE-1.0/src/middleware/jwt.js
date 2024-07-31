// Importez jwt et configurez la vérification du token
import jwt from "jsonwebtoken";

// Middleware pour vérifier le token
export const verifyToken = (req, res, next) => {
  // Récupérez le token depuis les cookies ou les headers (selon votre méthode)
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json("You are not authenticated!");
  }

  // Vérifiez le token
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    // Si le token est valide, ajoutez les informations du payload à la requête
    req.idAdmin = payload;  // ou req.idAdmin = payload.id; selon votre payload

    // Passez à la prochaine étape (généralement la route suivante)
    next();
  });
};
