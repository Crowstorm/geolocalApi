const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BmsSchema = new Schema({
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

const Bms = mongoose.model('company_company_copy', BmsSchema, 'company_company_copy2');
//trzeci argument preventuje utworzenie liczby mnogiej

module.exports = Bms;