var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var raspi = require("raspi-io");
var io = require('socket.io')(httpServer);
var fs = require('fs')
var spawn = require('child_process').spawn

var port = 3000;
var proc;

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

  socket.on('start-stream', function(){
    console.log('startStreaming function initiated')

    var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "50"];
    proc = spawn('raspistill', args);

    console.log('Watching for changes...');
    app.set('watchingFile', true);
    fs.watchFile('./stream/image_stream.jpg', { persistent: true, interval: 25 }, function(current, previous) {
      console.log('inside watchFile')
      socket.emit('livestream', '/public/stream/image_stream.jpg?_t=' + (Math.random() * 100000));
      console.log('livestream emitted...')
    })
  })

  socket.on('stop-stream', function(){
    console.log('stop-stream received')
    stopStreaming();
  })
});

function stopStreaming() {
  console.log('stopStreaming function initiated')
  app.set('watchingFile', false);
  if (proc) proc.kill();
  fs.unwatchFile('./stream/image_stream.jpg');
}

function startStreaming(io) {
  console.log('startStreaming function initiated')
  // if (app.get('watchingFile')) {
  //   io.sockets.emit('liveStream', './stream/image_stream.jpg?_t=' + (Math.random() * 100000));
  //   return;
  // }

  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "50"];
  proc = spawn('raspistill', args);

  console.log('Watching for changes...');
  app.set('watchingFile', true);
  fs.watchFile('./stream/image_stream.jpg', { persistent: true, interval: 25 }, function(current, previous) {
    io.socket.emit('liveStream', './stream/image_stream.jpg?_t=' + (Math.random() * 100000));
  })
}


console.log('Waiting for connection');
