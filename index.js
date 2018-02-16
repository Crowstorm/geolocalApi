const express = require('express');

//setup express app
const app = express();

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