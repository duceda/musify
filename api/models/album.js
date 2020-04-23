'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Artist = require('../models/artist');

// artist: { type: Schema.ObjectId, ref: Artist } esto guarda un id u objeto de otra tabla de ddbb
// es como la Foreign Key
var AlbumSchema = Schema({
  title: String,
  description: String,
  year: Number,
  image: String,
  artist: { type: Schema.ObjectId, ref: Artist }
});

module.exports = mongoose.model('Album', AlbumSchema);
