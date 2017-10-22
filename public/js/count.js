var socket = io();
$('#update').click(function() {
    var data = $('#spots').val();
    socket.emit('updateCount', {count:data, org:org});
})