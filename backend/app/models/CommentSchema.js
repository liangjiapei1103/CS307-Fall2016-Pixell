var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    replyTo: { type: Schema.Types.ObjectId, ref: 'User'},
    content: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = CommentSchema;
