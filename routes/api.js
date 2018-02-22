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

router.get('/ulica/all', function (req, res, next) {
    Baza.find().limit(120).then(function (baza, result) {
        let arr = _.toArray(baza);
        let coordsArr = [];

        let mainPromise = new Promise((resolve, reject) => {
            let noOfSuccess = 0;
            let noCoords = 0;

            let arrSucc = [];
            let arrFail = [];
            let arrCheck;

            let forEachPromise = new Promise((resolve, reject) => {
                arr.forEach((user, index) => {
                    let coordPromise = new Promise((resolve, reject) => {
                        console.log('street', user.ulica)

                        let street = user.ulica;
                        let city = user.miasto;

                        const address = encodeURI(street.concat(', ').concat(city));
                        const addressNoEncode = street.concat(', ').concat(city);

                        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;
                        // const elo = "Kwiatowa 53, Zakopane";
                        // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${elo}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;


                        setTimeout(function () {
                        let coords = axios.get(url).then((value) => {
                            const resp = {addressNoEncode, value}
                            return resp;
                        })
                        
                        resolve(coords);
                        }, 100 * index);

                    })

                    coordPromise.then(response => {
                        //console.log(response);
                        try {
                            if (response.value.data.status == 'ZERO_RESULTS') {
                                console.log('blednyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', index, response.addressNoEncode)
                                noCoords++;
                            } else if (response.value.data.results[0].types == "street_address") {
                                console.log('adres', response.value.data.results[0].formatted_address)
                                arrSucc.push(response.value.data.results[0].formatted_address);
                                noOfSuccess++;
                            } else if (response.value.data.results[0].types == "route") {
                                arrFail.push(response.value.data.results[0].formatted_address);
                                noCoords++;
                            }
                        }
                        catch(err){
                            console.log('err', err)
                            console.log('index', index)
                        }
                        console.log('coordResp', 'succ', noOfSuccess, 'fail', noCoords, 'typ', response.value.data.results[0].types )
                    })
                });

                resolve(noOfSuccess)
            })

            forEachPromise.then(response => {
                //console.log('resp', response)
            })
            resolve(noOfSuccess)
        })


        promise.then(response => {
            res.status(200).send({
                success: true,
                'data': coords
            });
        })


    })
})


// const forEachPromise = new Promise((resolve, reject) => {
//     arr.forEach((user, index) => {
//         let coordPromise = new Promise((resolve, reject) => {
//             const street = user.ulica;
//             const city = user.miasto;
//             const address = encodeURI(street.concat(', ').concat(city));
//             const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;

//             let coords = fetch(url, { method: 'GET' }).then(res => res.json())
//                 .then((json) => {
//                     coordsArr.push(json.results[0].formatted_address);
//                     console.log(coordsArr);
//                     return json.results[0].formatted_address;
//                 });
//             resolve(coords);
//         })

//         coordPromise.then(response =>{
//             console.log('res',response);
//         })

//         // console.log('jestem', coords);
//         // if (index + 1 == arr.length) {
//         //     console.log('jestem', coords);
//         //     resolve(coords);
//         // }

//     });
// });
// promise.then((coords) => {
//     console.log('done', coords.length);
// });





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