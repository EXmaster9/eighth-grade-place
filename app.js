var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('CLIENT CONNECTED');
	socket.on('clicko', function(data){
		io.emit('clickot', data);
	});
});

http.listen(port, function(){
	console.log('SERVER LISTENING ON PORT ' + port);
});
