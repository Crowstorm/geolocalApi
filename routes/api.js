const express = require('express');
const router = express.Router();

const Android = require('../models/android');
const Baza = require('../models/baza')


//testowa szukajka
router.get('/ulica', function(req, res, next) {
    Baza.find({imie: req.query.imie}).then(function(baza){
        res.send(baza);
    })
})

//dodaj rekord
router.post('/ulica', function (req, res, next) {
    // let android = new Android(req.body);
    // android.save();
    Baza.create(req.body).then(function(baza){
        res.send(baza);
    }).catch(next);

});

//dodaj lat lon
router.post('/ulica/coordy', function(req, res, next){
    const lat = req.body.lat;
    const lon = req.body.lon;
    const ulica = req.body.ulica;
    console.log(lat, lon, ulica);
    Baza.findOneAndUpdate({ulica: ulica}, {$set: { lat: lat, lon: lon } }).then(function(baza){
        res.send(baza);
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


module.exports = router; // export the router