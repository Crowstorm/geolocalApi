const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AndroidSchema = new Schema({
    name: {
        type: String,
        require: [true, "Name is required"],
    },
    model: {
        type: String
    },
    number: {
        type: Number
    },
    waifu: {
        type: Boolean,
        default: false
    }
});

const Android = mongoose.model('android', AndroidSchema);

module.exports = Android;