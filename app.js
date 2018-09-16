const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Vote = require('./models/vote');



//jalankan body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use((req,res,next) => {
    req.io = io;
    next()
});

//membuat folder public menjadi client server
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost:27017/chartrealtime-dev");

/* 
Routes
*/

// Render homepage.

app.get('/',(req,res) => {
    res.sendfile('index.html')
})

app.post('/vote',(req,res) => {
    var newVote = new Vote({
        name : req.body.name
    })
    newVote.save().then(() => console.log('saved'));


    Vote.aggregate(
        [{
            "$group": {
                "_id": "$name",
                "total_vote": { "$sum": 1 }
            }
        }],
        function (err, result) {
            if (err) throw err;
            console.log(result);
            req.io.sockets.emit('vote', result);
        }
    );
    res.send({ 'message': 'succesfully added' });

})


/*
Socket.io Setting
*/
io.on('connection',function(socket){
    Vote.aggregate(
        [{
            "$group": {
                "_id": "$name",
                "total_vote": { "$sum": 1 }
            }
        }],
        function (err, result) {
            if (err) throw err;
            socket.emit('vote', result);
        }
    )
    
})

server.listen(3000,function(){
    console.log('server running in port 3000');
});