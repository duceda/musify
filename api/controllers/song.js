// Los controladores son los intermediarios entre usuario y bbdd
'use strict'

var JWT = require('../services/jwt');

// importamos el módulo bcrypt para encriptar contraseñas
var bcrypt = require('bcrypt-nodejs');

// Importamos el modelo Song para tratar con la base de datos
var Song = require('../models/song');

// importamos el fileSystem y el path para trabajar con los ficheros y sus rutas
var fs = require('fs');
var path = require('path');

function getSong(req, res) {
  var songId = req.params.id;

  // Utilizamos el método populate para que popule los datos del objeto 
  // album asociado a la propiedad artist. El path sería donde se van a cargar 
  // las propiedades del album que ha creado el song
  // Se consiguen todos los datos del album de ese song
  // ES COMO UN JOIN
  Song.findById(songId).populate({ path: 'album' }).exec((err, songDDBB) => {
    if (err) {
      res.status(500).send({ message: 'Error al buscar la canción' });
    } else {
      if (!songDDBB) {
        res.status(404).send({ message: 'La canción no existe en la base de datos' });
      } else {
        res.status(200).send({ song: songDDBB });
      }
    }
  });
}

function saveSong(req, res) {
  var song = new Song();
  var params = req.body;

  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, songStored) => {
    if (err) {
      res.status(500).send({ message: 'Error en el servidor' });
    } else {
      if (!songStored) {
        res.status(404).send({ message: 'La canción no se ha podido guardar en base de datos' });
      } else {
        res.status(200).send({ song: songStored });
      }
    }
    
  })
}

function getSongs(req, res) {
  var albumId = req.params.album;

  if (!albumId) {
    // sacar todos los albums de la bbdd
    var find = Song.find({}).sort('number');
  } else {
    // sacar los albums de un artista concreto de la bbdd
    var find = Song.find({ album: albumId }).sort('number');
  }

  /* Le estamos diciendo que nos popule el album y dentro hacemos otro populate 
  para sacar los datos del artista y se le pasa el modelo, que nos sustituya en el path
  artist lo que se representa en el modelo de Artista
  */
  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, songs) => {
    if (err) {
      res.status(500).send({ message: 'Error en el servidor' });
    } else {
      if (!songs) {
        res.status(404).send({ message: 'No hay canciones en ese album' });
      } else {
        res.status(200).send({ songs: songs });
      }
    }
  });
}

function updateSong(req, res) {
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
    if (err) {
      res.status(500).send({ message: 'Error en el servidor' });
    } else {
      if (!songUpdated) {
        res.status(404).send({ message: 'Error guardando la canción' });
      } else {
        res.status(200).send({ song: songUpdated });
      }
    }
  })
}

function deleteSong(req, res) {
  var songId = req.params.id;
  
  Song.findByIdAndDelete(songId, (err, songDeleted) => {
    if (err) {
      res.status(500).send({ message: 'Error en el servidor' });
    } else {
      if (!songDeleted) {
        res.status(404).send({ message: 'Error borrando la canción' });
      } else {
        res.status(200).send({ song: songDeleted });
      }
    }
  })
}


function uploadFile(req, res){
  var songId = req.params.id;
  var filename = 'No subido';

  if (req.files) {
    var filePath = req.files.file.path;
    var fileSplit = filePath.split('/');
    var fileName = fileSplit[2];
    var extFile = fileName.split('.');
    var fileExt = extFile[1]
    console.log(extFile);

    if (fileExt === 'mp3' || fileExt === 'ogg') {
      Song.findByIdAndUpdate(songId, { file: fileName }, (err, songUpdated) => {
        if (songUpdated) {
          res.status(200).send({ file: songUpdated });
        } else {
          res.status(404).send({ message: 'No se ha podido actualizar la canción' });
        }
      });
    } else {
      res.status(200).send({ message: 'Extensión del archivo no válida' });
    }
  } else {
    res.status(200).send({ message: 'No ha subido ninguna fichero de audio' });
  }
}

function getSongFile(req, res) {
  var songFile = req.params.songFile;
  var pathFile = './uploads/songs/' + songFile;

  fs.exists(pathFile, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'No existe el fichero de audio' });
    }
  });
}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
};
