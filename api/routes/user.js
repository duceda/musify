// Dentro de routes tendremos las vistas de los controladores
'use strict'

// Se carga el módulo de express y el User Controller
var express = require('express');
var UserController = require('../controllers/user');

// Cargamos el router de express, esto nos permitirá crear rutas
var api = express.Router();

// Middleware para autenticación de token
var md_auth = require('../middlewares/authenticated');

// Este módulo nos permite subir un fichero al servidor
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' })

// Creamos las rutas
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;
