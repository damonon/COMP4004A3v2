var socket = io()
var localPlayer = 0
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
    console.log(data[0].playerid)
})