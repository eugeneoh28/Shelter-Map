var socket = io();
$(document).ready(function(){
  setInterval(function(){window.location.reload()}, 1000);
});

function refreshMap(){
  socket.emit('refreshMap', 'RefreshTickets!');
}

socket.on('mapRefresh', function(data) {
    $('.data').text(data.shelters[0].spotsLeft);
});