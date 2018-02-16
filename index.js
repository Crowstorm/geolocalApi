const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/api')

//setup express app
const app = express();

//body parser
app.use(bodyParser.json());

//initialize routes
app.use('/api', routes);

app.get('/api', function(req, res){
    console.log('get req');
    res.send({
        name: 'yoshi'
    });
})


//listen for requests
app.listen(process.env.port || 8000, function(){
    console.log('now listening for requests');
    
})