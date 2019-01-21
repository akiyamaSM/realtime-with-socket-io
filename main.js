var express = require('express') // Get the express instance
var app = express() // get the app instance
var server = require('http').Server(app) // server using http
var io = require('socket.io')(server) // socketio using the server instance

app.use(express.static('public'));


app.get('/home', function (request, response) {
    response.sendFile(__dirname + "/public/index.html")
})

io.on('connection', function (socket) {
	socket.on('connected', (name) => {
		socket.broadcast.emit('connected', name)
	})

	socket.on('send', (newMessage) => {
		socket.broadcast.emit('send', newMessage)
	})
})

server.listen(8080, function () {
    console.log('Listening...')
})

