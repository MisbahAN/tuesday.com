const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    isManager: { type: Boolean, required: false }
});

UsersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', UsersSchema);
