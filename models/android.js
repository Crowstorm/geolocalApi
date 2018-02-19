const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//create additional schema


const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere",

    }
})

const AndroidSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
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
    },
    geometry: GeoSchema
});

const Android = mongoose.model('android', AndroidSchema);

module.exports = Android;