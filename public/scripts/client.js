var socket = io()

socket.on('firstConnection', () => {
    console.log('gehiurogjk')
    $("#numofplayers").show()
    $("#joinGame").click((event) =>{
        var numHum = $("#humanplayers").val()
        console.log(numHum)
        var numAI = $("#aiplayers").val()
        console.log(numAI)

        var playerAmount = {humanPlayers: numHum, aiPlayers: numAI}
        socket.emit('getPlayers', playerAmount)
        event.preventDefault();
        $("#numofplayers").hide()
    })
    //$("#gameoptions").show()
})

socket.on('xConnection', () => {
    console.log("Hello?")
    $("#gameoptions").show()
    $('#joinRegular').click(()=>{
        $("#gameoptions").hide()
    })
})

socket.on('fullGame', () => {
    $("#fullgame").show()
})