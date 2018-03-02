const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BmsSchema = new Schema({
    //_id: String,
    addresses: [{
        route: String,
        street_number: String,
        locality: String,
        country: String,
        administrative_area_level_1: String,
        coordinates: Array,
        coordinatesSet: Boolean
    }],
    name: String,

});

//poprawna - stara dobra
//company_company -> z 1000 rekordow ustawionych poprawnie
const Bms = mongoose.model('company_company', BmsSchema, 'company_company');
//trzeci argument preventuje utworzenie liczby mnogiej

module.exports = Bms;