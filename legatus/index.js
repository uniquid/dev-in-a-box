'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(require('body-parser').json());

app.get('/', function(req, res) {
  res.send('<h1>Hello Legatus</h1>');
});

app.post('/send', function(req, res) {
console.log(req.body)
  io.emit(req.body.session_id, req.body)
  res.send({status: '200', message: 'ok'});
});

io.on('connection', function(socket) {
  console.log('a machine connected ' + socket.id);

  socket.on('message', function(msg) {
        console.log(msg)
    io.to(msg).emit('message', 'example');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
