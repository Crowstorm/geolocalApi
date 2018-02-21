const express = require('express');
const _ = require('lodash');
const axios = require('axios');
const fetch = require('node-fetch');
const api = require('../services/api');

//const forEach = require('async-foreach').forEach;

const router = express.Router();

const Android = require('../models/android');
const Baza = require('../models/baza')


//testowa szukajka
router.get('/ulica', function (req, res, next) {
    Baza.find({ imie: req.query.imie }).then(function (baza) {
        res.send(baza);
    })
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
    console.log(lat, lon, ulica);
    Baza.findOneAndUpdate({ ulica: ulica }, { $set: { lat: lat, lon: lon } }).then(function (baza, result) {
        // res.send(baza);
        res.status(200).send({ document: result, success: true });
    })

    // db.collection('bazas').updateOne({ "ulica": ulica }, { $set: { "lat": lat, "lon": lon } }, (err, result) => {
    //     if (err) {
    //       res.send({ 'error': 'An error has occurred' });
    //     } else {
    //       if (err) throw err;
    //       res.status(200).send({ document: result, success: true });
    //     }
    //   })
})

// export function getDatafromGeocode(address) {
//     //Split full address into parts
//     let result;
//     result = address.split(',');
//     console.log('result', result);

//     let street = result[0].replace(/\s/g, '');;
//     let city = result[1].replace(/\s/g, '');;
//     const country = 'PL';

//     console.log('test', street, city, country)

//     //api call url, podmienic klucz api, bo ten moj joł
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street},${city}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;
//     console.log(url);

//     const request = axios.get(url);
//     console.log(request);

//     return function (dispatch) {
//         dispatch({
//             type: GET_DATA_FROM_GEOCODE,
//             payload: request
//         })
//     }
// }

router.get('/ulica/all', function (req, res, next) {
    Baza.find().limit(10).then(function (baza, result) {
        let arr = _.toArray(baza);
        let coords = [];

        const promise = new Promise((resolve, reject) => {
            arr.forEach((user, index) => {
                // console.log(index);
                const street = user.ulica;
                const city = user.miasto;
                const address = encodeURI(street.concat(', ').concat(city));
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;

                // console.log(url);
                fetch(url, { method: 'GET' }).then(res => res.json())
                    .then((json) => {
                        coords.push(json);
                    });

                console.log(index, arr.length);
                if (index+1 == arr.length) {
                    resolve(coords);
                }
            });
        });

        // promise.then((coords) => {
        //     console.log('done', coords.length);
        // });

        // let mainPromise = new Promise((resolve, reject) => {
        //     let noOfSuccess = 0;
        //     let noCoords = 0;

        //     let arrSucc = [];
        //     let arrFail = [];
        //     let arrCheck;

        //     let forEachPromise = new Promise((resolve, reject) => {
        //         arr.forEach(user => {
        //             let coordPromise = new Promise((resolve, reject) => {
        //                 console.log('street', user.ulica)

        //                 let street = user.ulica;
        //                 let city = user.miasto;

        //                 let address = street.concat(', ').concat(city);

        //                 const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;

        //                 setTimeout(function () {
        //                     let coords = axios.get(url).then((response) => {
        //                         return response;
        //                     })
        //                     resolve(coords);
        //                 }, 1000);

        //             })

        //             coordPromise.then(response => {
        //                 if (response.data.results[0].types == "street_address") {
        //                     console.log('adres', response.data.results[0].formatted_address)
        //                     arrSucc.push(response.data.results[0].formatted_address);
        //                     noOfSuccess++;
        //                 } else {
        //                     arrFail.push(response.data.results[0].formatted_address);
        //                     noCoords++;
        //                 }
        //                 console.log('coordResp', 'succ', noOfSuccess, 'fail', noCoords)
        //             })
        //         });

        //         resolve(noOfSuccess)
        //     })

        //     forEachPromise.then(response => {
        //         //console.log('resp', response)
        //     })
        //     resolve(noOfSuccess)
        // })


        promise.then(response => {
            res.status(200).send({
                success: true,
                'data': coords
            });
        })


    })


})


// router.get('/ulica/all', function (req, res, next) {
//     Baza.find().then(function (results, err) {

//         if (err) {
//             return res.status(422).send({ success: false, error: err });
//         }

//         setLocalization(results).then((results) => {
//             res.status(200).send({
//                 success: true,
//                 'data': results
//             });
//         });


//     });
// });

// function setLocalization(results) {
//     const resultsCount = results.length;
//     const nieustawione = [];

//     return Promise((resolve, reject) => {
//         results.forEach((result, index) => {


//             if (!nieustawi) {
//                 nieustawione.push(tenniesutawiony);
//             }


//             if (resultsCount == index) {
//                 reolve(nieustawione);
//             }
//         });
//     });
// }

module.exports = router; // export the router