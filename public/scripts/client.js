var socket = io()

socket.on('firstConnection', () => {
    $("#numofplayers").show()
    $("#joinGame").click((event) =>{
        event.preventDefault();

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

socket.on('xConnection', () => {
    console.log("Hello?")
    $("#gameoptions").show()
})

socket.on('fullGame', () => {
    $("#fullgame").show()
})

socket.on('startgame',()=>{
    console.log("Display the start game board")
    $("#gameoptions").hide()
    $("#startgameboard").show()
})