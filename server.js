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
console.log('Server available at http://raspi:' + port);

//RPi board connection
var board = new five.Board({
  io: new raspi()
});

var turn;

board.on("ready", function() {
  console.log('Bot connected');
  turn = new five.Motor({
    pins: [1,2],
    invertPWM: true
  });

	turn.stop();
});


//Socket connection handler
io.on('connection', function (socket) {
  console.log(socket.id);

  socket.on('turn:left', function (data) {
    motor.rev(100);
    console.log('TURN LEFT RECEIVED');
  });

  socket.on('turn:right', function (data) {
    motor.fwd(100);
    console.log('TURN RIGHT RECEIVED');
  });

  socket.on('turn:off', function (data) {
    motor.stop();
    console.log('TURN OFF RECEIVED');
  });
});

console.log('Waiting for connection');
