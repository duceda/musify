'use strict'

// Se carga el módulo de express para poder crear nuevas rutas y el controlador
var express = require('express');
var ArtistController = require('../controllers/artist');
// Cargamos el router de express, esto nos permitirá crear rutas
var api = express.Router();
// Middleware para autenticación de token
var md_auth = require('../middlewares/authenticated');
// Este módulo nos permite subir un fichero al servidor
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' })

// Creamos las rutas
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;
