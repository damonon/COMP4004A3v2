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
    
    socket.on('winner',(data)=>{
        const { playerId, winnerInfo } = data;
        $("#display-winner").append(`
            <h4>Player/AI ${playerId}</h4>
            <h4>They had a ${winnerInfo[0].descr}</h4>
            <div id="winner-cards"></div>
        `)

        for (let card of data) {
            $('#winner-cards').html(`
                <div>${card.value}, ${card.suit}</div>
            `);
        }

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
        for(var i = 0; i < globalClients.length; i++){
            $("#board").append("<ul id='playerHand' class= table></ul>" )
            console.log("PlayerID " + globalClients[i].playerid)
            if(globalClients[i].playerid == localPlayer){
                displayCards(globalClients[i].hand)
            }
            else{
                $('#tag').append(`
                    <br><p>Player/AI ${globalClients[i].playerid}</p>
                    <ul id='${globalClients[i].playerid}' class= table></ul>
                    <P>DONE</P>
                `)

                for (let card of globalClients[i].hand) {
                    $('#'+globalClients[i].playerid).append(`
                       <li><div class='card back'>*</div></li>
                    `)
                }
            }
        }
        if(globalClients[0].type == "AI")
        {
            console.log(globalClients[0].strategy)
            globalClients[0].strategy = "strat1"
            socket.emit('AITurn',globalClients[0])
        }
        else if(globalClients[0].type == "Human")
        {
            console.log("Starting as Human")
        }
    })
    
    socket.on('nextTurn', (data)=>{
        console.log("hell this is new")
        $("#board").empty()
        $('#tag').empty()
        var idNextPlayer = null;
        for(var i = 0; i < globalClients.length-1; i++){
            if((data.playerid === globalClients[i].playerid))
            {
                globalClients[i] = data
                idNextPlayer = globalClients[i+1]
                console.log("In here " + idNextPlayer.type)
                console.log("Should be 3" + idNextPlayer.playerid)
                console.log(idNextPlayer.strategy)
            }
        }

        if(idNextPlayer !== null){
            if(idNextPlayer.type == "AI"){
                console.log(idNextPlayer.strategy)
                socket.emit('AITurn', idNextPlayer)
            }
            else if((idNextPlayer.type == "Human") && idNextPlayer.playerid == localPlayer)
            {
                console.log("ITS MY TURN")
                console.log(globalClients[0])
                console.log(globalClients[1])
                console.log(globalClients[2])
                $("#board").append("<ul id='playerHand' class= table></ul>" )
                for(var k = 0; k < globalClients.length; k++){
                    console.log("PlayerID " + globalClients[k].playerid)
                    if(globalClients[k].playerid == localPlayer){
                        for(let card of globalClients[k].hand){
                            $("#playerHand").append(`<li><label class='card rank-${card.value} ${card.suit}'>
                                                            <span class='rank'> ${card.value}</span>
                                                            <span class='suit'>&${card.suit};</span>
                                                            <input type="checkbox" name='${globalClients[k]}' value='${card.value}-${card.suit}'/>
                                                            </label>
                                                        </li>
                        `   )
                        }
                        $("#board").append(`<button type="submit" id="end-turn" value="End-Turn">End Turn</button>`)
                    }
                    else{
                        $('#tag').append(`
                            <br><p>Player/AI ${globalClients[k].playerid}</p>
                            <ul id='${globalClients[k].playerid}' class= table></ul>
                            <P>DONE</P>
                        `)
                        console.log(globalClients[k].hand)
                        for (let card of globalClients[k].hand) {
                            if(card.faceup == true)
                            {
                                console.log("Im in here")
                                $('#'+globalClients[k].playerid).append(`
                                    <li><div class='card rank-${card.value} ${card.suit}'>
                                            <span class='rank'> ${card.value}</span>
                                            <span class='suit'>&${card.suit};</span>
                                        </div>
                                    </li>
                                `)
                            }
                            else{
                                console.log("This is Fucked")
                                $('#'+globalClients[k].playerid).append(`
                                    <li><div class='card back'>*</div></li>
                                `)
                            }
                        }
                    }
                }
                $('#end-turn').click(()=>{
                    console.log("Hello World")
                    var discardElements = []
                    let checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
                    for (let box of checkedBoxes) {
                        console.log(box.value);
                        discardElements.push(box.value)
                    }
                    var data = {playerid:idNextPlayer.playerid, type:idNextPlayer.type, hand:idNextPlayer.hand, visible:idNextPlayer.visible, strategy:idNextPlayer.strategy, discard:discardElements}
    
                    socket.emit('playerTurn', data)
                })
    
            }
        }
        else{
            console.log("Waiting for Turn or Game Over")
            socket.emit("game-over")
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