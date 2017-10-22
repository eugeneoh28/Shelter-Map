var socket = io();
$(document).ready(function(){
  setInterval(function(){refreshMap()}, 100);
});

function refreshMap(){
  socket.emit('refreshMap', 'RefreshTickets!');
}

socket.on('mapRefresh', function(data) {
    $('.data').text(data.shelters[0].spotsLeft);
});