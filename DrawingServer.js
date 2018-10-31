const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

http.listen(port, () => console.log('listening on port ' + port));

app.use(express.static(__dirname + '/DrawWeb'));


io.on('connection', function(socket) {
    console.log("Connected to whiteboard room!");
    socket.on('drawings', function(data){
    socket.broadcast.emit('drawings', data);
  });

  socket.on('disconnect', function(){
    console.log('Leaving the whiteboard room.');
  });

});
