
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors           = require('cors')


const routes = require('./routes/api')

//setup express app
const app = express();

//connect to mongoDB
mongoose.connect('mongodb://localhost/test')
mongoose.Promise = global.Promise;

app.use(cors())

app.use(express.static('public'))

//test
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
//test

//body parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//initialize routes
app.use('/api', routes);

//error handling middleware
app.use(function(err, req, res, next){
    console.log(err);
    res.status(422).send({
        error: err.message
    })
});


//listen for requests
app.listen(process.env.port || 8000, function(){
    console.log('now listening for requests');
    
})