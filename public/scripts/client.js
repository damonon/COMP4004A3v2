var socket = io()

socket.on('firstConnection', () => {
    console.log('gehiurogjk')
    $("#numofplayers").show()
    $("#gameoptions").show()
})

socket.on('xConnection', () => {
    console.log("Hello?")
    $("#gameoptions").show()
})