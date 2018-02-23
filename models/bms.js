const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BmsSchema = new Schema({
    addresses: {
        route: String,
        country: String,
        administrative_area_level_1: String
    },
    set: {
        type: Boolean,
        default: false
    }
});

const Bms = mongoose.model('company_company_copy', BmsSchema, 'company_company_copy');
//trzeci argument preventuje utworzenie liczby mnogiej

module.exports = Bms;