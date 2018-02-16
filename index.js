const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/api')

//setup express app
const app = express();

//connect to mongoDB
mongoose.connect('mongodb://localhost/test')
mongoose.Promise = global.Promise;

//body parser
app.use(bodyParser.json());

//initialize routes
app.use('/api', routes);


//listen for requests
app.listen(process.env.port || 8000, function(){
    console.log('now listening for requests');
    
})