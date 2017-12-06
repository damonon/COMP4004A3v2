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
var Strategy1 = require("./common/Strategy1")

var firstClient = false
var allClients = [];
var availableSlots = [4,3,2,1];
var clients = []
var holdJson = []
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
        var test = {playerid: newPlayerID, type: "Human", cards: hand, strategy: "none"}
        holdJson.push(test)
        count++
        console.log(human)
        allClients.push(socket)
        clients.push(human)
        firstClient = true
        socket.emit('firstConnection',{playerID: newPlayerID})
    }
    else if(firstClient && (count < totalPlayers)){
        allClients.push(socket)
        var newPlayerID = availableSlots.pop()
        var hand = deck.getDeck().splice(-5,5)
        var human = new Player(newPlayerID, "Player " + newPlayerID, "none", hand)
        var test = {playerid: newPlayerID, type: "Human", cards: hand, strategy: "none"}
        holdJson.push(test)
        count++
        console.log(human)
        clients.push(human)
        socket.emit('xConnection', {playerID: newPlayerID})
        if(clients.length === totalPlayers){
            //console.log(clients)
            startGame()
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
            var test = {playerid: newPlayerID, type: "AI", cards: hand, strategy:data.ai1strat}
            holdJson.push(test)
            clients.push(ai)
            console.log(ai)
            console.log(clients.length)

            if(clients.length === totalPlayers){
                startGame()
            }
        }
        else if(numAIPlayers === 2){
            var newPlayerID = availableSlots.pop()
            count = count + 2
            var hand = deck.getDeck().splice(-5,5)
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat, hand)
            var test = {playerid: newPlayerID, type: "AI", cards: hand , strategy:data.ai1strat}
            holdJson.push(test)
            clients.push(ai)
            console.log(ai)

            var hand2 = deck.getDeck().splice(-5,5)
            var newPlayerID2 = availableSlots.pop()
            var ai2 = new Player(newPlayerID2, "AI " + newPlayerID2, data.ai2strat, hand2)
            var test2 = {playerid: newPlayerID, type: "AI", cards: hand, strategy:data.ai2strat}
            holdJson.push(test2)

            console.log(ai2)
            clients.push(ai2)

            if(clients.length === totalPlayers){
                startGame()
            }
        }
        else if (numAIPlayers === 3){
            var newPlayerID = availableSlots.pop()
            count = count + 3
            var hand = deck.getDeck().splice(-5,5)
            var ai = new Player(newPlayerID, "AI " + newPlayerID, data.ai1strat, hand)
            var test = {playerid: newPlayerID, type: "AI", cards: hand, strategy:data.ai1strat}
            holdJson.push(test)
            console.log(ai)
            clients.push(ai)

            var newPlayerID2 = availableSlots.pop()
            var hand2 = deck.getDeck().splice(-5,5)
            var ai2 = new Player(newPlayerID2, "AI " + newPlayerID2, data.ai2strat, hand2)
            var test2 = {playerid: newPlayerID, type: "AI", cards: hand, strategy:data.ai2strat}
            holdJson.push(test2)
            console.log(ai2)
            clients.push(ai2)

            var newPlayerID3 = availableSlots.pop()
            var hand3 = deck.getDeck().splice(-5,5)
            var ai3 = new Player(newPlayerID3, "AI " + newPlayerID3, data.ai3strat, hand3)
            var test3 = {playerid: newPlayerID, type: "AI", cards: hand, strategy:data.ai3strat}
            holdJson.push(test3)
            console.log(ai3)
            clients.push(ai3)

            if(clients.length === totalPlayers){
                startGame();
            }
        }
    })

    socket.on('getNumPlayers',(max)=>{
        console.log("Max " + max)
        totalPlayers = max
    })

    socket.on('AITurn',(data)=>{
        //evalute Hand
        //Exchange/discard hand
        console.log(data.playerid)
        console.log(data.type)
        console.log(data.cards)
        console.log(data.strategy)
        console.log("Doing AI Moves")
        var hand = deck.getDeck().splice(-5,5)
        var newHand = {playerid: data.playerid, type: "AI", cards: hand, strategy:data.strategy}
        socket.emit("nextTurn", newHand)
        //
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

function startGame(){
    console.log(holdJson)
    //Swap order to let AI go first
    holdJson.sort(function(a, b) {
        return a.type.localeCompare(b.type);
    });
    io.emit('startgame', holdJson)
}

var deck2 = new Deck()
var shuffledDeck = deck2.shuffleDeck()

var testHand = deck2.getDeck().splice(-5,5)
console.log(testHand)
/*[ Card { value: 'k', suit: 'hearts', number: '13', facedown: false },
Card { value: '9', suit: 'hearts', number: '9', facedown: false },
Card { value: 'q', suit: 'clubs', number: '12', facedown: false },
Card { value: '8', suit: 'diams', number: '8', facedown: false },
Card { value: '7', suit: 'hearts', number: '7', facedown: false } ]*/

var testPair = [ {value: 'a', suit: 'hearts', number: '14', facedown: false },
{ value: 'a', suit: 'spades', number: '14', facedown: false },
{ value: '10', suit: 'diams', number: '10', facedown: false },
{ value: 'j', suit: 'hearts', number: '11', facedown: false },
{ value: 'j', suit: 'hearts', number: '11', facedown: false }]
var strat1 = new Strategy1(testPair) 
strat1.checkHand(results => console.log(results))

//console.log("Strat1 returned: " + result.checkHold + " " + result.msg)
//Straight works
//Pairs Work
//Straight Flush works
//Royal Flush Works
//Three works
//Four WOrks
//fullhouse works

