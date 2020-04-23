'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
// clave secreta
var secret = 'clave_secreta_curso';

exports.ensureAuth = function (req, res, next){
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    }
    
    // eliminamos comillas simples y dobles por si llegase así
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'El token ha expirado'});
        } else {
            
        }
    } catch (e) {
        return res.status(404).send({message: 'Token inválido'});
    }

    req.user = payload;

    next();
};