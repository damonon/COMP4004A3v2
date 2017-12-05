var socket = io()
var localPlayer = null

//{playerid}
socket.on('firstConnection', (userInfo) => {
    $("#numofplayers").show()
    $("#joinGame").click((event) =>{
        event.preventDefault();
        localPlayer = userInfo
        console.log("userInfo1 " + localPlayer.playerID)
        var numHum = $("#humanplayers").val()
        console.log(numHum)
        var numAI = $("#aiplayers").val()
        console.log(numAI)
        var max = parseInt(numHum) + parseInt(numAI)
        socket.emit('getNumPlayers', max)
        $("#numofplayers").hide()
        if(numAI == 1){
            $("#ai2strat").hide()
            $("#ai3strat").hide()
            $("#displayAIMenu").show()
            $("#enterGame").click((event)=>{
                event.preventDefault();
                $("#displayAIMenu").hide()
                var ai1strat = $("#ai1strat").val()
                var gameInfo = {humanPlayers: numHum, aiPlayers: numAI, ai1strat: ai1strat}
                console.log(gameInfo)
                socket.emit('getPlayers', gameInfo)
            })
        }
        else if(numAI == 2){
            $("#ai3strat").hide()
            $("#displayAIMenu").show()
            $("#enterGame").click((event)=>{
                event.preventDefault();
                $("#displayAIMenu").hide()
                var ai1strat = $("#ai1strat").val()
                var ai2strat = $("#ai2strat").val()
                var gameInfo = {humanPlayers: numHum, aiPlayers: numAI, ai1strat: ai1strat, ai2strat: ai2strat}
                console.log(gameInfo)
                socket.emit('getPlayers', gameInfo)
            })
        }
        else if(numAI == 3){
            $("#displayAIMenu").show()
            $("#enterGame").click((event)=>{
                event.preventDefault();
                $("#displayAIMenu").hide()
                var ai1strat = $("#ai1strat").val()
                var ai2strat = $("#ai2strat").val()
                var ai3strat = $("#ai3strat").val()
                var gameInfo = {humanPlayers: numHum, aiPlayers: numAI, ai1strat: ai1strat, ai2strat: ai2strat, ai3strat: ai3strat}
                console.log(gameInfo)
                socket.emit('getPlayers', gameInfo)
            })
        }
    })
    //$("#gameoptions").show()
})

socket.on('xConnection', (userInfo) => {
    console.log("Hello?")
    localPlayer = userInfo
    console.log("userInfo " + localPlayer.playerID)
    $("#gameoptions").show()
})

socket.on('fullGame', () => {
    $("#fullgame").show()
})

//data = {playerid, type, cards}
socket.on('startgame',(data)=>{
    console.log("Display the start game board")
    $("#gameoptions").hide()
    $("#startgameboard").show()
    $("#board").append("<ul id='playerHand' class= table></ul>" )
    //console.log(data[0].playerid)
    for(var i = 0; i < data.length; i++){
        $("#board").append("<ul id='playerHand' class= table></ul>" )
        console.log("PlayerID " + data[i].playerid)
        console.log("Local Player ID" + localPlayer.playerid)
        if(data[i].type != "AI"){
            displayCards(data[i].cards)
        }
        else{
            $("#AIboard").append("<ul id='aiHand' class= table></ul>" )
            facedownCards(data[i].cards)
        }
    }
})

function displayCards(data){
    //$("#board").append("<ul id='playerHand' class= table></ul>" )
    for(var i = 0; i < data.length; i++){
        $("#playerHand").append("<li><div class='card rank-" + data[i].value + " " + data[i].suit + "'>"
        +      "<span class='rank'>" + data[i].value + "</span>"
        +      "<span class='suit'>&" + data[i].suit + ";</span>"
        +  "</div></li>")
    }
}
function facedownCards(data){
    //$("#board").append("<ul id='playerHand' class= table></ul>" )
    for(var i = 0; i < data.length; i++){
        $("#aiHand").append("<li><div class='card back'>*</div></li>")
    }
}