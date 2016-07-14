var socket = io.connect();

$(document).ready(function(){
// Keyboard controls for motors
  $("body").keydown(function(event){
    switch (event.which) {
      case 38:
      case 87:
        socket.emit('drive:fwd');
        break;
      case 40:
      case 83:
        socket.emit('drive:rev');
        break;
      case 37:
      case 65:
        socket.emit('turn:left');
        break;
      case 39:
      case 68:
        socket.emit('turn:right');
        break;
      default:
    }
  });

  $("body").keyup(function(event){
    switch (event.which) {
      case 38:
      case 87:
      case 40:
      case 83:
        socket.emit('drive:stop');
        break;
      case 37:
      case 65:
      case 39:
      case 68:
        socket.emit('turn:off');
        break;
      default:
    }
  });
// Button controls for motors
  $('#left').mousedown(function(){
    socket.emit('turn:left');
    console.log('TURN LEFT');
  })

  $('#right').mousedown(function(){
    socket.emit('turn:right');
    console.log('TURN LEFT');
  })

  $('#right, #left').mouseup(function(){
    socket.emit('turn:off');
    console.log('TURN LEFT');
  })

  $('#right, #left').mouseleave(function(){
    socket.emit('turn:off');
    console.log('TURN LEFT');
  })

  $('#fwd').mousedown(function() {
    socket.emit('drive:fwd');
    console.log('DRIVE FWD')
  });

  $('#rev').mousedown(function() {
    socket.emit('drive:rev');
    console.log('DRIVE REV')
  });

  $('#fwd, #rev').mouseup(function() {
    socket.emit('drive:stop');
    console.log('DRIVE STOP')
  });

  $('#fwd, #rev').mouseleave(function() {
    socket.emit('drive:stop');
    console.log('DRIVE STOP')
  });

  $('#pwr').on('change', function(){
    socket.emit('updatePwr', $(this).val())
    console.log('UPDATE DRIVE PWR TO: ' + $(this).val())
  });
// MJPEG handler
  // send request to start stream on page load
  $("#play").on('click', function() {
    console.log('sent start-stream call')
    socket.emit('start-stream');
  });

  $("#pause").on('click', function() {
    console.log('sent stop-stream call')
    socket.emit('stop-stream');
    $("#stream").attr('src', '')
  });

  // update img url as received
  socket.on('livestream', function(url) {
    console.log('received livestream call from server.')
    $("#stream").attr('src', url)
  });
});
