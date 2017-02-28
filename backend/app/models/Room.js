var mongoose = require('mongoose');

var Room = new mongoose.Schema({
  between: Array
});

module.exports = mongoose.model('Room', Room);
