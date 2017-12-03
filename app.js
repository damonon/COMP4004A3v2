var express = require('express')
var app = express()
var favicon = require('serve-favicon')
var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var Player = require(__dirname + "/public/common/Player")

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

        allClients.push(socket)
        socket.emit('firstConnection')
    }
    else if(availableSlots.length != 0){
        allClients.push(socket)
        var newPlayerID = availableSlots.pop()
        socket.emit('xConnection')
    }
    else if(availableSlots.length === 0){
        socket.emit('fullGame')
    }

    socket.on('getPlayers',(data)=>{
        numHumPlayers = data.humanPlayers
        numAIPlayers = data.aiPlayers
        console.log(numHumPlayers);
        console.log(numAIPlayers)
        
        if(numAIPlayers != 0){
            for(var i = 0; i < numAIPlayers; i++){
                addAI()
            }
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
    
}