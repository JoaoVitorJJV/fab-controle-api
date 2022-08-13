import dotenv from 'dotenv'


dotenv.config();

function verifyCentral(req, res, next){
    const token = req.headers['authorization']; 
    const tokenCentral = process.env.SECRET_CENTRAL

    if(token === tokenCentral){
        next();
    }else{
        return res.json({auth: false, msg: 'Token inválido.'})
    }
   
}

export default verifyCentral