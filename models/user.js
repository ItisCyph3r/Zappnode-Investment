// dependencies
require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// connect to database
mongoose.connect(process.env.USER_SECRET);

// Create Model
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        // required: true
    },
    username: {
        type: String,
        // required: true
    },
    raw_password: {
        type: String,
        min: 8,
        max: Infinity
    },
    password: {
        type: String,
        min: 8,
        max: Infinity,
        // required: true
    },
});
// Export Model
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('userData', User, 'userData');