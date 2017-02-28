var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: { type: String, unique: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Post'}],
    orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Post'}],
    avatarUrl: String,
    rate_value: Number,
    rate_number: Number,
    resetToken: String,
    resetExpires: Date
});

module.exports = UserSchema;
