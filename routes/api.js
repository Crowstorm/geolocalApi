const express = require('express');
const _ = require('lodash');
const axios = require('axios');
const fetch = require('node-fetch');
const api = require('../services/api');

//const forEach = require('async-foreach').forEach;

const router = express.Router();

const Android = require('../models/android');
const Baza = require('../models/baza')
const Bms = require('../models/bms')

//ustaw jaka baza ma byc przerabiana (schema)
const baza = Bms;

//testowa szukajka
router.get('/ulica', function (req, res, next) {
    // db.getCollection('company_company_copy').find({}).then(function (baza){
    //     res.send(baza);
    // })
    baza.find({ name: "Gabinet Weterynaryjny" }).limit(5).then(function (baza) {
        //console.log(baza.name)
        res.send(baza);

    }).catch(next);
})

//dodaj rekord
router.post('/ulica', function (req, res, next) {
    // let android = new Android(req.body);
    // android.save();
    Baza.create(req.body).then(function (baza) {
        res.send(baza);
    }).catch(next);

});

//dodaj lat lon
router.post('/ulica/coordy', function (req, res, next) {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const ulica = req.body.ulica;
    const miasto = req.body.miasto;
    console.log(lat, lng, ulica);
    Baza.findOneAndUpdate({ ulica: ulica, miasto: miasto }, { $set: { lat, lng } }).then(function (baza, result) {
        // res.send(baza);
        res.status(200).send({ document: result, success: true });
    })
})

var mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

//usun rekord z bazy
router.delete('/database/delete/', (req, res, next) => {
    let id = 'ObjectId("'.concat(req.body.id).concat('")');
    //let id2 = req.body.id;
    let id2 = ObjectId(String(req.body.id))

    console.log(id, id2)
    baza.findByIdAndRemove(id2).then((err, client) => {
        console.log(client)
        if (err) return res.status(500).send(err);
        const response = {
            msg: "Klient usuniety z bazy",
            success: true
        }
        return res.status(200).send(response);
    })
})

//masowka 2.0
router.get('/geoloc/all', (req, res, next) => {
    baza.find({ "addresses.coordinatesSet": null }).limit(100).then((records, result) => {
        let arr = _.toArray(records);
        let coordsArr = [];

        let forEachPromise = new Promise((resolve, reject) => {
            //Do zwrotki dla usera
            let noOfSuccess = 0;
            let noCoords = 0;
            let arrSucc = [];
            let arrFail = [];
            let arrCheck = [];
            let arraysOfUsers = { arrSucc, arrCheck, arrFail, noOfSuccess, noCoords };

            arr.forEach((record, index) => {
                //console.log(user);
                if (!record.addresses[0]) {
                    console.log('Brak adresu');
                    noCoords = noCoords +1;
                    console.log('fejle', noCoords)
                    arrFail.push(record);
                } else {
                    let coordPromise = new Promise((resolve, reject) => {
                        //console.log(record);
                        const street = record.addresses[0].route.concat(', ').concat(record.addresses[0].street_number);
                        //console.log('ulica', street)
                        const city = record.addresses[0].locality;
                        //console.log('miasto', city)

                        const address = encodeURI(street.concat(', ').concat(city)); //Dla API
                        const addressNoEncode = street.concat(', ').concat(city); //Dla zwrotki
                        //1 klucz
                        //AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI
                        //2 klucz api
                        //AIzaSyD4N5V3BF_gXXHy5ZC_EuQGYTgUkc3Feb0
                        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyD4N5V3BF_gXXHy5ZC_EuQGYTgUkc3Feb0`;
                        setTimeout(function () {
                            let coords = axios.get(url).then((value) => {
                                if (value.data.status == 'OK') {

                                    const resp = {
                                        addressNoEncode: addressNoEncode,
                                        googleMapData: value,
                                        streetAPI: record.addresses[0].route.concat(', ').concat(record.addresses[0].street_number),
                                        cityAPI: record.addresses[0].locality,
                                        lat: value.data.results[0].geometry.location.lat,
                                        lng: value.data.results[0].geometry.location.lng,
                                        clientId: record._id
                                    };

                                    resolve(resp);
                                } else {
                                    const error = 'Could not get coordinates';
                                    const resp = { error: error, faultyUser: record.name };
                                    resolve(resp);
                                }
                            })
                        }, 100 * index);
                    })

                    coordPromise.then(response => {
                        let arrPromise = new Promise((resolve, reject) =>{
                            if (!response.error) {
                                //console.log('response', response)
                                //console.log('id', response.clientId);
                                baza.findByIdAndUpdate(response.clientId, { $set: { "addresses.0.coordinates": [response.lat, response.lng], "addresses.0.coordinatesSet": true } }, { new: true }).then((update) => {
                                    //console.log(update);
                                    // res.status(200).send({
                                    //     success: true,
                                    //     'data': update
                                    // });
                                    arrSucc.push(update);
                                    noOfSuccess = noOfSuccess +1;
                                    console.log('sakcesy', noOfSuccess)
                                })
                            } else {
                                console.log('Nie mozna ustawic adresu')
                                console.log(response.error)
                                arrFail.push(response.faultyUser);
                            }
                            resolve(arraysOfUsers);
                        })
                        
                        arrPromise.then(coords => {
                            // console.log('ostateczny', coords);
                            if (index +1  == arr.length) {
                                console.log('koniec');
                                resolve(coords);
                            }
                        })
                    })
                }
                
            })

           // resolve(arraysOfUsers);
        })

        forEachPromise.then(response =>{
            res.status(200).send({
                success: true,
                'data': response
            });
        })
    })
})



//pojedyncze rekordy
router.get('/geoloc/single', (req, res, next) => {
    baza.find({ "addresses.coordinatesSet": null }).limit(2).then((record, result) => {
        let coordPromise = new Promise((resolve, reject) => {
            if (!record[0].addresses[0]) {
                const resp = {
                    error: 'No address found',
                    name: record[0].name,
                    clientId: record[0]._id,
                    phoneNumber: (_.get(record[0], 'phones[0].number', 'Brak telefonu'))
                };
                resolve(resp);
            } else {
                const streetAPI = record[0].addresses[0].route.concat(', ').concat(record[0].addresses[0].street_number);
                const cityAPI = record[0].addresses[0].locality;
                const id = record[0]._id;

                const address = encodeURI(streetAPI.concat(', ').concat(cityAPI)); //Dla API
                const addressNoEncode = streetAPI.concat(', ').concat(cityAPI); //Dla zwrotki
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;

                let coords = axios.get(url).then((value) => {
                    if (value.data.status == 'OK') {

                        const resp = {
                            addressNoEncode: addressNoEncode,
                            googleMapData: value,
                            streetAPI: streetAPI,
                            cityAPI: cityAPI,
                            lat: value.data.results[0].geometry.location.lat,
                            lng: value.data.results[0].geometry.location.lng,
                            clientId: id
                        };

                        resolve(resp);
                    } else {
                        const error = 'Could not get coordinates';
                        const resp = { error: error };
                        resolve(resp);
                    }
                })
            }
        })

        coordPromise.then(response => {
            if (!response.error) {
                baza.findByIdAndUpdate(response.clientId, { $set: { "addresses.0.coordinates": [response.lat, response.lng], "addresses.0.coordinatesSet": true } }, { new: true }).then((update) => {
                    //console.log(update);
                    res.status(200).send({
                        success: true,
                        'data': update
                    });
                })
            } else {
                res.status(200).send({
                    success: true,
                    'data': response
                });;
            }
        })
    })
})

//masowka
router.get('/ulica/all', function (req, res, next) {
    baza.find().limit(1).then(function (baza, result) {
        let arr = _.toArray(baza);
        let coordsArr = [];

        //Nie wiem czy potrzebny promise, iksDe, do poprawy
        let mainPromise = new Promise((resolve, reject) => {
            //promise dla foreacha
            let forEachPromise = new Promise((resolve, reject) => {
                //Do zwrotki dla usera
                let noOfSuccess = 0;
                let noCoords = 0;
                let arrSucc = [];
                let arrFail = [];
                let arrCheck = [];
                let arraysOfUsers = { arrSucc, arrCheck, arrFail };
                arr.forEach((user, index) => {
                    //Promise pobierajacy dane z google API
                    //console.log('user', user)
                    let coordPromise = new Promise((resolve, reject) => {
                        const street = user.addresses[0].route.concat(', ').concat(user.addresses[0].street_number);
                        console.log('ulica', street)
                        const city = user.addresses[0].locality;
                        console.log('miasto', city)

                        const address = encodeURI(street.concat(', ').concat(city)); //Dla API
                        const addressNoEncode = street.concat(', ').concat(city); //Dla zwrotki

                        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;
                        setTimeout(function () {
                            let coords = axios.get(url).then((value) => {
                                const resp = { addressNoEncode, value, street, city }
                                return resp;
                            })
                            resolve(coords);
                        }, 100 * index);

                    })

                    //Resolve promise z API, segregacja rekordow do odpowiednich tablic
                    coordPromise.then(response => {
                        let arrPromise = new Promise((resolve, reject) => {
                            try {
                                if (response.value.data.status == 'ZERO_RESULTS') {
                                    //console.log('bledny', index, response.addressNoEncode)
                                    noCoords++;
                                    arrFail.push(response.addressNoEncode);
                                } else if (response.value.data.results[0].types == "street_address") {
                                    //console.log('adres', response.value.data.results[0].formatted_address)
                                    arrSucc.push(response.value.data.results[0].formatted_address);

                                    //Zupdejtuj w bazie
                                    const ulica = response.street.split(',');

                                    let ulicaNazwa = ulica[0].replace(/\s/g, '');
                                    let ulicaNumer = ulica[1].replace(/\s/g, '');


                                    const miasto = response.city;
                                    const lat = response.value.data.results[0].geometry.location.lat;
                                    const lon = response.value.data.results[0].geometry.location.lng;
                                    console.log(ulicaNazwa, 'naxzwa', ulicaNumer, 'numer,', miasto, 'at', lat, 'lon', lon);
                                    Bms.findOneAndUpdate({ "addresses.route": ulicaNazwa, "addresses.street_number": ulicaNumer, "addresses.locality": miasto }, { $set: { lat: lat, lon: lon, coordsSet: true } }).then(function (baza, result) {
                                        console.log('baza', baza)
                                    })

                                    noOfSuccess++;
                                } else if (response.value.data.results[0].types != "street_address") {
                                    arrFail.push(response.value.data.results[0].formatted_address);
                                    noCoords++;
                                }
                            }
                            catch (err) {
                                console.log('err', err)
                                console.log('index', index)
                            }
                            console.log('coordResp', 'succ', noOfSuccess, 'fail', noCoords, 'typ', response.value.data.results[0].types)
                            resolve(arraysOfUsers);
                        })
                        //Chce odzyskac arrays of users i przeslac go dalej
                        arrPromise.then(coords => {
                            // console.log('ostateczny', coords);
                            if (index + 1 == arr.length) {
                                resolve(coords);
                            }
                        })
                    })
                });
                console.log('ostateczny', arraysOfUsers);
            })

            //wychodze z nastepnego promise
            forEachPromise.then(coords => {
                // console.log('O KURWA WYSZŁEM', coords)
                resolve(coords);
            })
        })

        //wysylam tablice sukcesow i porazek do uzytkownika
        mainPromise.then(response => {
            res.status(200).send({
                success: true,
                'data': response
            });
        })

    })
})

module.exports = router; // export the router