var express = require('express')
var app = express()
var favicon = require('serve-favicon')
var path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var Player = require("./common/Player")
var Card = require("./common/Card")
var Deck  = require("./common/Deck")
var firstClient = false
var allClients = [];
var availableSlots = [4,3,2,1];
var clients = []
var MAX_PLAYERS = 3;
var numAIPlayers = 0;
var numHumPlayers = 0;
var totalPlayers = 0;
var count = 0;

var deck = new Deck()
var shuffledDeck = deck.shuffleDeck()
console.log(shuffledDeck)


//Middleware
app.use(express.static(path.join(__dirname, "/public")));

server.listen(port,()=>{
    console.log('Server listening at port %d', port)
})

//Routes
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/views/Poker.html");
});

//2 Human 1 AI and 3 Human 1 AI does not work
io.on('connection', function(socket){
    
    //console.log(allClients.length)
    if(!firstClient){
        var newPlayerID = availableSlots.pop()
        var hand = deck.getDeck().splice(-5,5)
        var human = new Player(newPlayerID, "Player " + newPlayerID, "none", hand)
        count++
        console.log(human)
        allClients.push(socket)
        clients.push(human)
        firstClient = true
        socket.emit('firstConnection')
    }
    else if(firstClient && (count < totalPlayers)){
        allClients.push(socket)
        var newPlayerID = availableSlots.pop()
        var hand = deck.getDeck().splice(-5,5)
        var human = new Player(newPlayerID, "Player " + newPlayerID, "none", hand)
        count++
        console.log(human)
        clients.push(human)
        socket.emit('xConnection')
        if(clients.length === totalPlayers){
            io.emit('startgame')
        }
    }
    else if(count >= totalPlayers && firstClient){
        console.log(firstClient)
        console.log("IN HERE " + count)
        console.log("IN Herer " + totalPlayers)
        socket.emit('fullGame')
    }

    socket.on('getPlayers',(data)=>{
        numHumPlayers = parseInt(data.humanPlayers)
        numAIPlayers = parseInt(data.aiPlayers)
        console.log(numHumPlayers);
        console.log(numAIPlayers)
        
        if(numAIPlayers === 1){
            var newPlayerID = availableSlots.pop()
            var hand = deck.getDeck().splice(-5,5)
            count = count + 1
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat, hand)
            clients.push(ai)
            console.log(ai)
            console.log(clients.length)

            if(clients.length === totalPlayers){
                io.emit('startgame')
            }
        }
        else if(numAIPlayers === 2){
            var newPlayerID = availableSlots.pop()
            count = count + 2
            var hand = deck.getDeck().splice(-5,5)
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat, hand)
            clients.push(ai)
            console.log(ai)
            var hand2 = deck.getDeck().splice(-5,5)
            var newPlayerID2 = availableSlots.pop()
            var ai2 = new Player(newPlayerID2, "AI " + newPlayerID2, data.ai2strat, hand2)

            console.log(ai2)
            clients.push(ai2)

            if(clients.length === totalPlayers){
                io.emit('startgame')
            }
        }
        else if (numAIPlayers === 3){
            var newPlayerID = availableSlots.pop()
            count = count + 3
            var hand = deck.getDeck().splice(-5,5)
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat, hand)
            console.log(ai)
            clients.push(ai)

            var newPlayerID2 = availableSlots.pop()
            var hand2 = deck.getDeck().splice(-5,5)
            var ai2 = new Player(newPlayerID2, "AI " + newPlayerID2, data.ai2strat, hand2)
            console.log(ai2)
            clients.push(ai2)

            var newPlayerID3 = availableSlots.pop()
            var hand3 = deck.getDeck().splice(-5,5)
            var ai3 = new Player(newPlayerID3, "AI " + newPlayerID3, data.ai3strat, hand3)
            console.log(ai3)
            clients.push(ai3)

            if(clients.length === totalPlayers){
                io.emit('startgame')
            }
        }
    })

    socket.on('getNumPlayers',(max)=>{
        console.log("Max " + max)
        totalPlayers = max
    })
    socket.on('disconnect', ()=>{
        console.log('Client disconnect!')
        var i = allClients.indexOf(socket)
        allClients.splice(i,1)
    })

    console.log("count " + count)
    console.log("totalPlayer " + totalPlayers)
    console.log("clients length " + clients.length)

})

function addAI(){
    console.log("adding AI")
    var newPlayerID = availableSlots.pop()
    var ai = new Player(newPLayerID, "AI " + newPlayerID)
    
}