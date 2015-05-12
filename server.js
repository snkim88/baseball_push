var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cp = require('child_process');
var child = cp.fork('./notificator.js')

var sockets = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.html');
});

child.on('message', function(msg) {
	console.log(msg);
	for(var i=0; i<sockets.length; i++){
		sockets[i].emit('notification', msg);
	}
});

io.on('connection', function(socket){
	sockets.push(socket);
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});

child.send('start');
