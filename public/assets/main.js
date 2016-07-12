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

});
