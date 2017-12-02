var express = require('express')
var app = express()
var favicon = require('serve-favicon')
var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var allClients = [];
var numPlayers = [];
var MAX_PLAYERS = 3;
console.log(numPlayers.length);
var count = 1;

//Middleware
app.use(express.static(path.join(__dirname, "/public")));

server.listen(port,()=>{
    console.log('Server listening at port %d', port)
})

//Routes
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/views/Poker.html");
});


io.on('connection', function(socket){
    
    console.log(allClients.length)
    if(allClients.length === 0){
        console.log('iuejgr')
        allClients.push(socket)
        socket.emit('firstConnection')
    }
    else if(allClients.length <= MAX_PLAYERS){
        console.log('yghujlk')
        allClients.push(socket)
        socket.emit('xConnection')
    }
    else{
        socket.emit('fullGame')
    }

    socket.on('getPlayers',(data)=>{
        console.log(data.humanPlayers);
        console.log(data.aiPlayers)
    })
    socket.on('disconnect', ()=>{
        console.log('Client disconnect!')
        var i = allClients.indexOf(socket)
        allClients.splice(i,1)
    })

})