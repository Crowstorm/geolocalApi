const express = require('express');
const router = express.Router();

//get list of androids
router.get('/androids', function (req, res) {
    res.send({ type: 'GET' });
});

//add new android
router.post('/androids', function (req, res) {
    console.log(req.body);
    res.send({
        type: 'POST',
        name: req.body.name,
        weight: req.body.weight
    });
});

router.put('/androids/:id', function (req, res) {
    res.send({ type: 'PUT' });
});

router.delete('/androids/:id', function (req, res) {
    res.send({ type: 'DELETE' });
});

module.exports = router;