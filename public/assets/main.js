var socket = io.connect();

$(document).ready(function(){

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

});
