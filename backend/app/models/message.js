var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Message = new mongoose.Schema({
  roomId: String,
  text: String,
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  createAt: String
});

module.exports = mongoose.model('Message', Message);
