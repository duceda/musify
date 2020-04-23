'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String,
  image: String
});

// para poder usar el model User se utiliza module.exports
// cuando nosotros creemos un usuario User tendrá que responder al Schema UserSchema
module.exports = mongoose.model('User', UserSchema);
