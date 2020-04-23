'use strict'

var fs = require('fs');
var path = require('path');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var paginate = require('mongoose-pagination');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artistDDBB) => {
        if (err) {
            res.status(500).send({ message: 'Error al buscar el artista' });
        } else {
            if (!artistDDBB) {
                res.status(404).send({ message: 'El artista no existe en la base de datos' });
            } else {
                res.status(200).send({ artist: artistDDBB });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;

    console.log(params);

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    });
}

function getArtists(req, res) {
    var itemsPerPage = 5;
    var artistId = req.params.id;

    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artistsDDBB, itemsTotal) => {
        if (err) {
            res.status(500).send({ message: 'Error al buscar artistas' });
        } else {
            if (artistsDDBB) {
                return res.status(200).send({ totalItems: itemsTotal, artists: artistsDDBB });
            } else {
                res.status(404).send({ message: 'No hay artistas en la base de datos' });
            }
        }
    });
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar artista' });
        } else {
            if (artistUpdated) {
                return res.status(200).send({ artist: artistUpdated });
            } else {
                res.status(404).send({ message: 'El artista no se encontró en base de datos' });
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar artista' });
        } else {
            if (artistRemoved) {
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
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
            } else {
                res.status(404).send({ message: 'El artista no se encontró en base de datos' });
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var filename = 'No subido';

    if (req.files) {
      var filePath = req.files.image.path;
      var fileSplit = filePath.split('/');
      var fileName = fileSplit[2];
      var extFile = fileName.split('.');
      var fileExt = extFile[1]
      console.log(extFile);
  
      if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
        Artist.findByIdAndUpdate(artistId, { image: fileName }, (err, artistUpdated) => {
          if (artistUpdated) {
            res.status(200).send({ artistUpdated });
          } else {
            res.status(404).send({ message: 'No se ha podido actualizar el artista' });
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
    var pathFile = './uploads/artists/' + imageFile;
  
    fs.exists(pathFile, function (exists) {
      if (exists) {
        res.sendFile(path.resolve(pathFile));
      } else {
        res.status(200).send({ message: 'No existe la imagen' });
      }
    });
  }

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};