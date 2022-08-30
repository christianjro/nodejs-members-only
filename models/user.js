const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    username: {type: String, required: true},
    password: {type: String, required: true},
    member: {type: Boolean, default: false},
    admin: {type: Boolean, default: false}
});

module.exports = mongoose.model("User", userSchema);