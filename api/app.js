'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargamos los ficheros de rutas como si fuera un módulo
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http mediante un middleware
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTION, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTION, PUT, DELETE');

    next();
})

// Rutas base
// Esta ruta /api es como un middleware, como una ruta intermedia 
// Toda ruta de la app tendrá un api delante
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;
