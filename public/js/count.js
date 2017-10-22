var socket = io();

function updateCount () {
    socket.emit('updatecount', {count:1});
}
