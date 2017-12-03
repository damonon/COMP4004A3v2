var express = require('express')
var app = express()
var favicon = require('serve-favicon')
var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var Player = require(__dirname + "/common/Player")

var allClients = [];
var availableSlots = [4,3,2,1];
var clients = []
var MAX_PLAYERS = 3;
var numAIPlayers = 0;
var numHumPlayers = 0;
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
    
    //console.log(allClients.length)
    if(allClients.length === 0){
        var newPlayerID = availableSlots.pop()
        var human = new Player(newPlayerID, "Player " + newPlayerID, "none")
        console.log(human)
        allClients.push(socket)
        socket.emit('firstConnection')
    }
    else if(availableSlots.length != 0){
        allClients.push(socket)
        var newPlayerID = availableSlots.pop()
        var human = new Player(newPlayerID, "Player " + newPlayerID, "none")
        console.log(human)
        socket.emit('xConnection')
    }
    else if(availableSlots.length === 0){
        socket.emit('fullGame')
    }

    socket.on('getPlayers',(data)=>{
        numHumPlayers = data.humanPlayers
        numAIPlayers = parseInt(data.aiPlayers)
        console.log(numHumPlayers);
        console.log(numAIPlayers)
        
        if(numAIPlayers === 1){
            var newPlayerID = availableSlots.pop()
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat)
            console.log(ai)
        }
        else if(numAIPlayers === 2){
            var newPlayerID = availableSlots.pop()
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat)
            console.log(ai)

            var newPlayerID2 = availableSlots.pop()
            var ai2 = new Player(newPlayerID2, "AI " + newPlayerID2, data.ai2strat)
            console.log(ai2)
        }
        else if (numAIPlayers ===3){
            var newPlayerID = availableSlots.pop()
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat)
            console.log(ai)

            var newPlayerID2 = availableSlots.pop()
            var ai2 = new Player(newPlayerID2, "AI " + newPlayerID2, data.ai2strat)
            console.log(ai2)

            var newPlayerID3 = availableSlots.pop()
            var ai3 = new Player(newPlayerID3, "AI " + newPlayerID3, data.ai3strat)
            console.log(ai3)
        }
    })

    socket.on('disconnect', ()=>{
        console.log('Client disconnect!')
        var i = allClients.indexOf(socket)
        allClients.splice(i,1)
    })

})

function addAI(){
    console.log("adding AI")
    var newPlayerID = availableSlots.pop()
    var ai = new Player(newPLayerID, "AI " + newPlayerID)
    
}