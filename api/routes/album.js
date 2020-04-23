// Dentro de routes tendremos las vistas de los controladores
'use strict'

// Se carga el módulo de express y el album Controller
var express = require('express');
var AlbumController = require('../controllers/album');

// Cargamos el router de express, esto nos permitirá crear rutas
var api = express.Router();

// Middleware para autenticación de token
var md_auth = require('../middlewares/authenticated');

// Este módulo nos permite subir un fichero al servidor
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' })

// Creamos las rutas
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;
