// Dentro de routes tendremos las vistas de los controladores
'use strict'

// Se carga el módulo de express y el song Controller
var express = require('express');
var SongController = require('../controllers/song');

// Cargamos el router de express, esto nos permitirá crear rutas
var api = express.Router();

// Middleware para autenticación de token
var md_auth = require('../middlewares/authenticated');

// Este módulo nos permite subir un fichero al servidor
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' })

// Creamos las rutas
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;
