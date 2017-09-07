// require express
var express = require("express");
var app = express();
var users = {};

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

app.use(express.static(__dirname));

var server = app.listen(8000, function() {
	console.log("listening on port 8000");
});

var io = require('socket.io').listen(server)
// Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function(socket) {
	console.log("WE ARE USING SOCKETS!");
	console.log(socket.id);

	socket.on('requestName', function(data) {
		var name = data.name.trim();
		if(!name) {
			socket.emit('nameResponse', {status: 'Not Good', name: name})
		} else {
			users[socket.id] = name;
			var message = "<b>" + name + ' has entered the room.</b>';
			socket.emit('nameResponse', {status: 'Cool', name: name})
			io.emit('serverResponse', {message : message});
		}
	})

	socket.on('sendMessage', function(data) {
		var message = users[socket.id] + ': ' + data.message;
		io.emit('serverResponse', {message : message});
	})

	socket.on('disconnect', function() {
		io.emit('serverResponse', {message:"<b>" + users[socket.id] + " has left the room</b>"})
	})
});