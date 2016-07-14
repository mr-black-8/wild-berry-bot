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
var drive;
var drivePwr;

board.on("ready", function() {
  console.log('Bot connected');
  turn = new five.Motor({
    pins: [1, 2],
    invertPWM: true
  });

  drive = new five.Motor({
    pins: [23, 22],
    invertPWM: true
  });

  drivePwr = 100;
	turn.stop();
  drive.stop();
});



//Socket connection handler
io.on('connection', function(socket) {
  console.log(socket.id);

  socket.on('turn:left', function(data) {
    turn.rev(200);
    console.log('TURN LEFT RECEIVED');
  });

  socket.on('turn:right', function(data) {
    turn.fwd(200);
    console.log('TURN RIGHT RECEIVED');
  });

  socket.on('turn:off', function(data) {
    turn.stop();
    console.log('TURN OFF RECEIVED')
  });

  socket.on('drive:fwd', function(data){
    drive.fwd(drivePwr);
    console.log('DRIVE FWD RECEIVED PWR: ' + drivePwr);
  });

  socket.on('drive:rev', function(data){
    drive.rev(drivePwr);
    console.log('DRIVE REV RECEIVED PWR: ' + drivePwr);
  });

  socket.on('drive:stop', function(data){
    drive.stop();
    console.log('DRIVE STOP RECEIVED');
  });

  socket.on('updatePwr', function(data){
    drivePwr = data;
    console.log('NEW DRIVE POWER: ' + data);
  });
});

console.log('Waiting for connection');
