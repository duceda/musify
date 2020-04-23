// Los controladores son los intermediarios entre usuario y bbdd
'use strict'

var JWT = require('../services/jwt');

// importamos el módulo bcrypt para encriptar contraseñas
var bcrypt = require('bcrypt-nodejs');

// Importamos el modelo User para tratar con la base de datos
var User = require('../models/user');

// importamos el fileSystem y el path para trabajar con los ficheros y sus rutas
var fs = require('fs');
var path = require('path');

function pruebas(req, res) {
  res.status(200).send({
    message: 'Probando una acción del controlador de USUARIOS (USER.JS) de la app de mean2'
  });
}

function saveUser(req, res) {
  var user = new User();

  var params = req.body;

  console.log(params);

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  // Tenemos usuarios normales (ROLE_USER) o admin  (ROLE_ADMIN)
  // Por defecto se crea como user, sino tendremos que cambiar esto
  user.role = 'ROLE_USER';
  user.image = 'null';

  if (params.password) {
    // Encriptar contraseñas y guardar datos
    bcrypt.hash(params.password, null, null, function (err, hash) {
      user.password = hash;

      if (user.name != null && user.surname != null && user.email != null) {
        // guardamos usuario en base de datos
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: 'Error al guardar el usuario' });
          } else {
            if (!userStored) {
              res.status(404).send({ message: 'No se ha registrado el usuario' });
            } else {
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: 'Introduce todos los datos del usuario' });
      }
    })
    user.password = params.password;
  } else {
    res.status(200).send({ message: 'Introduce la contraseña' });
  }

}

function loginUser(req, res) {
  var params = req.body;

  console.log(params);

  var email = params.email;
  var password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    console.log(user);
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!user) {
        res.status(404).send({ message: 'El usuario no existe' });
      } else {
        bcrypt.compare(password, user.password, function (err, check) {
          if (check) {
            // Se devuelven todos los datos del usuario logueado
            // Se guarda todo en un token de JWT
            if (params.gethash) {
              res.status(200).send({ token: JWT.createToken(user) });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res.status(404).send({ message: 'El usuario no ha podido loguearse' });
          }
        });
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;

  if (userId != req.body._id) {
    return res.status(500).send({ message: 'No tienes permisos para actualizar este usuario' });
  }

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Error al actualizar el usuario' });
    } else {
      if (userUpdated) {
        res.status(200).send({ userUpdated });
      } else {
        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
      }
    }
  });

}

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = 'ImagenNoSubida';

  if (req.files) {
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('/');
    var fileName = fileSplit[2];
    var extFile = fileName.split('.');
    var fileExt = extFile[1]
    console.log(extFile);

    if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
      User.findByIdAndUpdate(userId, { image: fileName }, (err, userUpdated) => {
        if (userUpdated) {
          res.status(200).send({
            image: fileName,
            user: userUpdated
          });
        } else {
          res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
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
  var pathFile = './uploads/users/' + imageFile;

  fs.exists(pathFile, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'No existe la imagen' });
    }
  });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
