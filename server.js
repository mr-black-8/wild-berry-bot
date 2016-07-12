

// server.js
var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var raspi = require("raspi-io");
var io = require('socket.io')(httpServer);

var port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port);
console.log('Server available at http://localhost:' + port);
var motor;

//RPi board connection

var board = new five.Board({
  io: new raspi()
});
board.on("ready", function() {
    console.log('Bot connected');
    motor = new five.Motor({
	pins: [1,2],
	invertPWM: true
	});
	
	motor.stop();
});


//Socket connection handler
io.on('connection', function (socket) {
        console.log(socket.id);

        socket.on('motor:on', function (data) {
           motor.fwd(100);
           console.log('MOTOR ON RECEIVED');
        });

        socket.on('motor:off', function (data) {
            motor.stop();
            console.log('MOTOR OFF RECEIVED');

        });
    });

console.log('Waiting for connection');
