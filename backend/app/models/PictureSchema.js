var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new mongoose.Schema({
    imageUrl: String,
    postId: { type: Schema.Types.ObjectId, ref: 'Post'},
});

module.exports = PictureSchema;
