const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {

    //token header
    const token = req.header('x-auth-token');

    //not token conditon
    if(!token) {
        return res.status(401).json( { msg : 'No token, denied'}); 
    }

    try {
        const decoded = jwt.verify ( token, config.get('jwt'));
        req.user = decoded.user;
        next();
    }catch(err) {
        res.status(401).json({msg : 'Token not valid'});
    }
}