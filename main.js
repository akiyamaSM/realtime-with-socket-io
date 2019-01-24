var express = require('express') // Get the express instance
var app = express() // get the app instance
var server = require('http').Server(app) // server using http
var io = require('socket.io')(server) // socketio using the server instance

app.use(express.static('public'));


app.get('/home', function (request, response) {
    response.sendFile(__dirname + "/public/index.html")
})

let users = [];
let sockets = {};

io.on('connection', function (socket) {


	socket.on('connected', (name) => {

		if(users.includes(name)){
			socket.emit('connect_response', false)

			return;

		}else{

			users.push(name)
			sockets[name] = socket;

			socket.emit('connect_response', true)

			socket.broadcast.emit('connected', name)

		}
			io.emit('connected_users', users)

		
	})

	socket.on('send_whisper', (newMessage) => {
		sockets[newMessage.onlyFor].emit('send', newMessage);
	})

	socket.on('send', (newMessage) => {
		if(newMessage.content.indexOf('/w') !== -1){
			if(newMessage.content.indexOf('Houssain') !== -1){
				sockets[newMessage.onlyFor].emit('send', newMessage);
				return;
			}
		}else{
			socket.broadcast.emit('send', newMessage)
		}
	})

	socket.on('isTyping', (name) => {
		socket.broadcast.emit('isTyping', name)
	})

	socket.on('clean_typing', (name) => {
		socket.broadcast.emit('clean_typing', name)
	})

	socket.on('leave', (name) => {
		users = users.filter(item => !(item === name))

		socket.broadcast.emit('user_left', name)
		socket.broadcast.emit('clean_typing', name)
		delete sockets[name];
	})
})

server.listen(3000, function () {
    console.log('Listening...')
})

