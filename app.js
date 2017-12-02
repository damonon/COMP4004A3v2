var express = require('express')
var app = express()
var favicon = require('serve-favicon')
var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);

var numPlayers = [];
console.log(numPlayers.length);
var count = 1;
//Middleware
app.use(express.static(path.join(__dirname, "/public")));

server.listen(3000)

//Routes
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/views/Poker.html");
});


io.on('connection', function(socket){
    if(numPlayers.length === 0){
        console.log('iuejgr')
        numPlayers.push(count)
        socket.emit('firstConnection')
    }
    else {
        console.log('yghujlk')
        numPlayers.push(count++)
        socket.emit('xConnection')
    }
})