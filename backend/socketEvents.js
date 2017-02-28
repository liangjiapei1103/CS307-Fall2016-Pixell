exports = module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.join('Campus');
    socket.on('chat mounted', function(user) {
      // TODO: Does the server need to know the user?
      console.log("receive chat mounted");
      socket.emit('receive socket', socket.id)
    })
    socket.on('leave room', function(room) {
      socket.leave(room)
    })
    socket.on('join room', function(room) {
      socket.join(room.name)
    })
    socket.on('new message', function(msg) {
      socket.broadcast.to(msg.roomId).emit('new bc message', msg);
    });
    socket.on('new room', function(channel) {
      socket.broadcast.emit('new room', channel)
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });
  });
}
