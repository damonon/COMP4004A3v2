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
var Strategy2 = require("./common/Strategy2")

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
var visibleCards = []
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
            var test2 = {playerid: newPlayerID2, type: "AI", cards: hand2, strategy:data.ai2strat}
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
            var test2 = {playerid: newPlayerID2, type: "AI", cards: hand2, strategy:data.ai2strat}
            holdJson.push(test2)
            console.log(ai2)
            clients.push(ai2)

            var newPlayerID3 = availableSlots.pop()
            var hand3 = deck.getDeck().splice(-5,5)
            var ai3 = new Player(newPlayerID3, "AI " + newPlayerID3, data.ai3strat, hand3)
            var test3 = {playerid: newPlayerID3, type: "AI", cards: hand3, strategy:data.ai3strat}
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
        var playerid = data.playerid
        var type = data.type
        var currentHand = data.cards
        var strategy = data.strategy
        console.log("Doing AI Moves")
        console.log("Playerid AI " + playerid)
        console.log("Player type " + type)
        console.log("Cards Current " + currentHand[0].number + " " + currentHand[0].suit)
        console.log("Cards Current " + currentHand[1].number + " " + currentHand[1].suit)
        console.log("Cards Current " + currentHand[2].number + " " + currentHand[2].suit)
        console.log("Cards Current " + currentHand[3].number + " " + currentHand[3].suit)
        console.log("Cards Current " + currentHand[4].number + " " + currentHand[4].suit)
        console.log("Player strategy " + strategy)
        if(data.strategy == "strat1"){
            console.log("Eval Strat1");
            var strat1 = new Strategy1(data.cards)
            strat1.checkHand(results => {
                console.log(results.checkHold)
                if(results.checkHold == "swap"){
                    var newCards = []
                    var numCardsToAdd = 5 - results.getNewHand.length
                    
                    if(numCardsToAdd === 3){
                        newCards = [deck.pop(), deck.pop(), deck.pop()]
                        for(var i = 0; i < newCards.length; i++){
                            newCards[i].setFaceUp(true)
                        }
                        visibleCards.push(newCards)
                        console.log(newCards)
                        console.log(playerid)
                        var newHand = results.getNewHand.concat(newCards)
                        console.log("New Hand" + newHand)
                        var data = {playerid: playerid, type: type, hand: newHand, visible: newCards, strategy: strategy}
                        socket.emit("nextTurn", data)

                    }
                    else if(numCardsToAdd === 2){
                        newCards = [deck.pop(), deck.pop()]
                        for(var i = 0; i < newCards.length; i++){
                            newCards[i].setFaceUp(true)
                        }
                        console.log(newCards)
                        visibleCards.push(newCards)
                        console.log(playerid)
                        var newHand = results.getNewHand.concat(newCards)
                        console.log("New Hand" + newHand)
                        var data = {playerid: playerid, type: type, hand: newHand, visible: newCards, strategy: strategy}
                        socket.emit("nextTurn", data)
                    }
                    else if(numCardsToAdd === 1){
                        newCards = [deck.pop()]
                        newCards[0].setFaceUp(true)
                        visibleCards.push(newCards)
                        var newHand = results.getNewHand.concat(newCards)
                        var data = {playerid: playerid, type: type, hand: newHand, visible: newCards, strategy: strategy}
                        socket.emit("nextTurn", data)
                    }
                }
                else if(results.checkHold == "swapAll"){
                    newCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(),deck.pop()]
                    for(var i = 0; i < newCards.length; i++){
                        newCards[i].setFaceUp(true)
                    }
                    visibleCards.push(newCards)
                    console.log(newCards)
                    console.log(playerid)
                    var data = {playerid: playerid, type: type, hand: newCards, visible: newCards, strategy: strategy}
                    socket.emit("nextTurn", data)
                }
                else{
                    console.log("HOLDING EVERYTHING")
                    var data = {playerid: playerid, type: type, hand: currentHand, strategy: strategy}
                    socket.emit("nextTurn", data)
                }
            })
        }
        else if(data.strategy == "strat2"){
            console.log("Do Stuff Strat2")
            console.log(visibleCards)
            console.log(data.cards[0])
            console.log(data.cards[1])
            console.log(data.cards[2])
            console.log(data.cards[3])
            console.log(data.cards[4])

            var strategycheck = null
            if(visibleCards.length === 0){
                strategycheck = new Strategy2(hand)
            }
            else{
                strategycheck = new Strategy2(data.cards, visibleCards)
            }

            strategycheck.checkHand(results => {
                console.log("I GET SOMETHING BACK")
                if(results.checkHold == "swap"){
                    var newCards = []
                    var numCardsToAdd = 5 - results.getNewHand.length
                    
                    if(numCardsToAdd === 3){
                        newCards = [deck.pop(), deck.pop(), deck.pop()]
                        for(var i = 0; i < newCards.length; i++){
                            newCards[i].setFaceUp(true)
                        }
                        visibleCards.push(newCards)
                        console.log(newCards)
                        console.log(playerid)
                        var newHand = results.getNewHand.concat(newCards)
                        console.log("New Hand" + newHand)
                        var data = {playerid: playerid, type: type, hand: newHand, visible: newCards, strategy: strategy}
                        socket.emit("nextTurn", data)

                    }
                    else if(numCardsToAdd === 2){
                        newCards = [deck.pop(), deck.pop()]
                        for(var i = 0; i < newCards.length; i++){
                            newCards[i].setFaceUp(true)
                        }
                        console.log(newCards)
                        visibleCards.push(newCards)
                        console.log(playerid)
                        var newHand = results.getNewHand.concat(newCards)
                        console.log("New Hand" + newHand)
                        var data = {playerid: playerid, type: type, hand: newHand, visible: newCards, strategy: strategy}
                        socket.emit("nextTurn", data)
                    }
                    else if(numCardsToAdd === 1){
                        newCards = [deck.pop()]
                        newCards[0].setFaceUp(true)
                        visibleCards.push(newCards)
                        var newHand = results.getNewHand.concat(newCards)
                        var data = {playerid: playerid, type: type, hand: newHand, visible: newCards, strategy: strategy}
                        socket.emit("nextTurn", data)
                    }
                }
                else if(results.checkHold == "swapAll"){
                    newCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(),deck.pop()]
                    for(var i = 0; i < newCards.length; i++){
                        newCards[i].setFaceUp(true)
                    }
                    visibleCards.push(newCards)
                    console.log(newCards)
                    console.log(playerid)
                    var data = {playerid: playerid, type: type, hand: newCards, visible: newCards, strategy: strategy}
                    socket.emit("nextTurn", data)
                }
                else{
                    console.log("HOLDING EVERYTHING")
                    var data = {playerid: playerid, type: type, hand: currentHand, strategy: strategy}
                    socket.emit("nextTurn", data)
                }
            })
            
        }
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
{ value: 'q', suit: 'hearts', number: '12', facedown: false }]
var strat1 = new Strategy1(testPair) 
strat1.checkHand(results => {
    console.log(results)
    console.log(results.getNewHand.length)
})

//console.log("Strat1 returned: " + result.checkHold + " " + result.msg)
//Straight works
//Pairs Work
//Straight Flush works
//Royal Flush Works
//Three works
//Four WOrks
//fullhouse works

