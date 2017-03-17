module.exports = function (socket) {
  socket.broadcast.emit('user connected')
  socket.emit('news', { hello: 'world' })
  socket.on('my other event', function (data) {
    console.log(data)
    socket.emit('news', { hello: 'world' })
  })
}
