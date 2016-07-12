var socket = io.connect();

$(document).ready(function(){

  $('#on').on('click', function(){
    socket.emit('motor:on');
    console.log('MOTOR ON');
  })

  $('#off').on('click', function(){
    socket.emit('motor:off');
    console.log('MOTOR OFF');
  })

});
