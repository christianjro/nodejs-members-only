const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: {type: String, required: true},
    timestamp: {type: Date, required: true, default: Date.now},
    text: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model("Message", messageSchema);