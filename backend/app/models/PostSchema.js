var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    buyer: { type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    price: Number,
    condition: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    pictures: [{ type: Schema.Types.ObjectId, ref: 'Picture'}],
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    avalability: { type: Boolean, default: true },
    viewsNum: { type: Number, default: 0 },
    likesNum: { type: Number, default: 0 },
    type: String,
    rate_valid: { type: Boolean, default: true }
});

module.exports = PostSchema;
