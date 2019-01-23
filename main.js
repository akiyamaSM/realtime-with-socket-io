var express = require('express') // Get the express instance
var app = express() // get the app instance
var server = require('http').Server(app) // server using http
var io = require('socket.io')(server) // socketio using the server instance

app.use(express.static('public'));


app.get('/home', function (request, response) {
    response.sendFile(__dirname + "/public/index.html")
})

let users = [];


io.on('connection', function (socket) {


	socket.on('connected', (name) => {

		users.push(name)

		socket.broadcast.emit('connected', name)

		io.emit('connected_users', users)

	})

	socket.on('send', (newMessage) => {
		socket.broadcast.emit('send', newMessage)
	})

	socket.on('isTyping', (name) => {
		socket.broadcast.emit('isTyping', name)
	})

	socket.on('clean_typing', (name) => {
		socket.broadcast.emit('clean_typing', name)
	})
})

server.listen(8080, function () {
    console.log('Listening...')
})

