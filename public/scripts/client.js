$(document).ready(() => {
    var socket = io()
    var localPlayer = null
    var globalClients = null
    //{playerid}
    socket.on('firstConnection', (userInfo) => {
        $("#numofplayers").show()
        $("#joinGame").click((event) =>{
            event.preventDefault();
            localPlayer = userInfo.playerID
            window.name = `${userInfo.playerID}`
            console.log(window.name)
            console.log(userInfo)
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
        localPlayer = userInfo.playerID
        //localPlayer = userInfo
        $("#gameoptions").show()
    })
    
    socket.on('fullGame', () => {
        $("#fullgame").show()
    })
    
    //data = {playerid, type, cards}
    socket.on('startgame',(data)=>{
        globalClients = data
        console.log("Global CLient" + globalClients)
        console.log("Local Player: "+localPlayer)
        console.log("Display the start game board")
        $("#gameoptions").hide()
        $("#startgameboard").show()
        $("#board").append("<ul id='playerHand' class= table></ul>" )
        //console.log(data[0].playerid)
        for(var i = 0; i < data.length; i++){
            $("#board").append("<ul id='playerHand' class= table></ul>" )
            console.log("PlayerID " + data[i].playerid)
            if(data[i].playerid == localPlayer){
                displayCards(data[i].cards)
            }
            else{
                $("#AIboard").append("<ul id='aiHand' class= table></ul>" )
                facedownCards(data[i].cards)
            }
        }
        if(data[0].type == "AI")
        {
            console.log(data[0].strategy)
            data[0].strategy = "strat1"
            socket.emit('AITurn',data[0])
        }
        else if(data[0].type == "Human")
        {
            console.log("Starting as Human")
        }
    })
    
    socket.on('nextTurn', (data)=>{
        console.log("hell this is new")
        var idNextPlayer = null;
        for(var i = 0; i < globalClients.length; i++){
            if((data.playerid == globalClients[i].playerid))
            {
                globalClients[i] = data
                idNextPlayer = globalClients[i+1]
                console.log("In here " + idNextPlayer.type)
                console.log("Should be 3" + idNextPlayer.playerid)
                console.log(idNextPlayer.strategy)
            }
            else if(idNextPlayer == null){
                console.log("Game is done")
            }
        }
        if(idNextPlayer.type == "AI"){
            console.log(idNextPlayer.strategy)
            socket.emit('AITurn', idNextPlayer)
        }
        else if((idNextPlayer.type == "Human") && idNextPlayer.playerid == localPlayer)
        {
            console.log("ITS MY TURN")
        }
        else{
            console.log("Waiting for Turn or Game Over")
        }

        console.log(globalClients[0].hand)
        //console.log("Next Turn Player " + idNextPlayer.playerid + " " + idNextPlayer.type)
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
});