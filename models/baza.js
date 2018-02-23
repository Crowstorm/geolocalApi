const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BazaSchema = new Schema({
    name: {
        type: String
    },
    nazwisko: {
        type: String
    },
    ulica: {
        type: String
    },
    "nr mieszkania": {
        type: Number
    },
    uczelnia: {
        type: String
    },
    zawód: {
        type: String
    },
    płeć: {
        type: String
    },
    wiek: {
        type: Number
    },
    wzrost: {
        type: Number
    },
    miasto: {
        type: String
    },
    wojewodztwo: {
        type: String
    },
    lat:{
        type: String
    },
    lon: {
        type: String
    },
    set: {
        type: Boolean,
        default: false
    }
});

const Baza = mongoose.model('baza', BazaSchema);

module.exports = Baza;