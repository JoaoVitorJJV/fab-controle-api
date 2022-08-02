import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config();
const jwt = jsonwebtoken

function verifyJWT(req, res, next){
    const token = req.headers['authorization']; 
    if (!token) return res.status(200).json({ auth: false, message: 'Nenhum token informado.', error: true});
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(200).json({ auth: false, message: 'Failed to authenticate token.', error:true });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      
      next();
    });
}

export default verifyJWT