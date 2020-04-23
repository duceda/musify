// Los controladores son los intermediarios entre usuario y bbdd
'use strict'

var JWT = require('../services/jwt');

// importamos el módulo bcrypt para encriptar contraseñas
var bcrypt = require('bcrypt-nodejs');

// Importamos el modelo User para tratar con la base de datos
var Album = require('../models/album');
var Song = require('../models/song');

// importamos el fileSystem y el path para trabajar con los ficheros y sus rutas
var fs = require('fs');
var path = require('path');

function getAlbum(req, res) {
  var albumId = req.params.id;

  // Utilizamos el método populate para que popule los datos del objeto 
  // artista asociado a la propiedad artist. El path sería donde se van a cargar 
  // las propiedades del artista que ha creado el album
  // Se consiguen todos los datos del artista de ese album
  // ES COMO UN JOIN
  Album.findById(albumId).populate({ path: 'artist' }).exec((err, albumDDBB) => {
    if (err) {
      res.status(500).send({ message: 'Error al buscar el album' });
    } else {
      if (!albumDDBB) {
        res.status(404).send({ message: 'El album no existe en la base de datos' });
      } else {
        res.status(200).send({ album: albumDDBB });
      }
    }
  });
}

function saveAlbum(req, res) {
  var album = new Album();
  var params = req.body;

  console.log(params);

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({ message: 'Error al guardar el album' });
    } else {
      if (!albumStored) {
        res.status(404).send({ message: 'El album no ha sido guardado' });
      } else {
        res.status(200).send({ album: albumStored });
      }
    }
  });
}

function getAlbums(req, res) {
  var albumId = req.params.artist;

  if (!albumId) {
    // sacar todos los albums de la bbdd
    var find = Album.find({}).sort('title');
  } else {
    // sacar los albums de un artista concreto de la bbdd
    var find = Album.find({ artist: albumId }).sort('year');
  }

  find.populate({ path: 'artist' }).exec((err, albums) => {
    if (err) {
      res.status(500).send({ message: 'Error al leer albums' });
    } else {
      if (!albums) {
        res.status(404).send({ message: 'No hay albums en la base de datos' });
      } else {
        res.status(200).send({ albums });
      }
    }
  });
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Error al actualizar album' });
    } else {
      if (albumUpdated) {
        console.log(update);
        res.status(200).send({ albumUpdated });
      } else {
        res.status(404).send({ message: 'El album no se encontró en base de datos' });
      }
    }
  });
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if (err) {
      res.status(500).send({ message: 'Error al eliminar album' });
    } else {
      if (albumRemoved) {
        Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
          if (err) {
            res.status(500).send({ message: 'Error al eliminar canción' });
          } else {
            if (songRemoved) {
              res.status(200).send({ song: songRemoved });
            } else {
              res.status(404).send({ message: 'La canción no se encontró en base de datos' });
            }
          }
        });
      } else {
        res.status(404).send({ message: 'El album no se encontró en base de datos' });
      }
    }
  });
}

function uploadImage(req, res){
  var albumId = req.params.id;
  var filename = 'No subido';

  if (req.files) {
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('/');
    var fileName = fileSplit[2];
    var extFile = fileName.split('.');
    var fileExt = extFile[1]
    console.log(extFile);

    if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
      Album.findByIdAndUpdate(albumId, { image: fileName }, (err, albumUpdated) => {
        if (albumUpdated) {
          res.status(200).send({ album: albumUpdated });
        } else {
          res.status(404).send({ message: 'No se ha podido actualizar el album' });
        }
      });
    } else {
      res.status(200).send({ message: 'Extensión del archivo no válida' });
    }
  } else {
    res.status(200).send({ message: 'No ha subido ninguna imagen' });
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var pathFile = './uploads/albums/' + imageFile;

  fs.exists(pathFile, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'No existe la imagen' });
    }
  });
}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
