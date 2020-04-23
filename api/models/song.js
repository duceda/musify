'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Album = require('../models/album');

// artist: { type: Schema.ObjectId, ref: Artist } esto guarda un id u objeto de otra tabla de ddbb
// es como la Foreign Key
var SongSchema = Schema({
  number: String,
  name: String,
  duration: String,
  file: String,
  album: { type: Schema.ObjectId, ref: Album }
});

module.exports = mongoose.model('Song', SongSchema);
