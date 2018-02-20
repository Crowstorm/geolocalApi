const express = require('express');
const _ = require('lodash');
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
    Baza.find().then(function (baza, result) {
        let arr = _.toArray(baza);
        //console.log(arr);
        //res.status(200).send({ document: result, success: true });
        let imiona = [];
        arr.forEach(function (user) {
            //console.log(user.ulica);
            imiona.push(user.imie);
            console.log(imiona)

        })
        
        res.send(imiona);
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