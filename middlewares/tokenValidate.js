const jwt = require('jsonwebtoken');
const { use } = require('../routes/users');
require("dotenv").config();

const tokenControllers = {};

tokenControllers.VerificarJwt = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: "Token no encontrado, usuario no autorizado", tipoerror: "error", tipoerror: "tokenno" });
        const { user } = jwt.verify(token, `process.env.SECRET_WORD`);
        req.userId = user.id;
        next();
    } catch (error) {
        if (!token) return res.status(401).json({ message: "Token expirado, por favor logearse nuevamente", icon: "error", tipoerror: "tokenexp" });
    }
};

tokenControllers.decoToken = (req, res, next) => {    

    try {
        const token = req.header('Authorization');        
        if (!token) return res.status(401).json({ message: 'Token no encontrado', icon: "error", tipoerror: "tokenno" })
        const { user } = jwt.verify(token, `process.env.SECRET_WORD`);
        req.userId = user.id;    
        console.log("token bien"+user.id)            
        next();
    } catch (error) {              
        if (error.message === 'jwt expired') return res.status(401).json({ message: 'Token expirado, por favor logearse nuevamente', icon: "error", tipoerror: "tokenexp" });
        return error;
    }
}

module.exports = tokenControllers;

