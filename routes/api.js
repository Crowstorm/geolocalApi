const express = require('express');
const router = express.Router();

const Android = require('../models/android')

//get list of androids
router.get('/androids', function (req, res) {
    res.send({ type: 'GET' });
});

//add new android
router.post('/androids', function (req, res) {
    // let android = new Android(req.body);
    // android.save();
    Android.create(req.body).then(function(android){
        res.send(android);
    });

});

router.put('/androids/:id', function (req, res) {
    res.send({ type: 'PUT' });
});

router.delete('/androids/:id', function (req, res) {
    res.send({ type: 'DELETE' });
});

module.exports = router;