const express = require('express');
const router = express.Router();

const Android = require('../models/android');
const Baza = require('../models/baza')

//get list of androids
router.get('/androids', function (req, res, next) {
    Android.find({name: req.query.name}).then(function(android){
        res.send(android);
    })

    // Android.geoNear(
    //     {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]}
    // ).then(function(androids){
    //     res.send(androids);
    // })
});

router.get('/ulica', function(req, res, next) {
    Baza.find({imie: req.query.imie}).then(function(baza){
        res.send(baza);
    })
})

//add new android
router.post('/androids', function (req, res, next) {
    // let android = new Android(req.body);
    // android.save();
    Android.create(req.body).then(function(android){
        res.send(android);
    }).catch(next);

});

router.post('/ulica', function (req, res, next) {
    // let android = new Android(req.body);
    // android.save();
    Baza.create(req.body).then(function(baza){
        res.send(baza);
    }).catch(next);

});

router.put('/androids/:id', function (req, res, next) {
    Android.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Android.findOne({_id: req.params.id}).then(function(android){
            res.send(android);
        })
    })
});

router.delete('/androids/:id', function (req, res, next) {
    Android.findByIdAndRemove({_id: req.params.id}).then(function(android){
        res.send(android);
    })
  //  res.send({ type: 'DELETE' });
});

module.exports = router; // export the router