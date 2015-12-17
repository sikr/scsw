/*
 * SCSW - Skeleton of a secure (https) server with websocket
 */

(function() {

var fs          = require('fs');
var key         = fs.readFileSync('ssl/key.pem');
var certificate = fs.readFileSync('ssl/cert.pem');
var credentials = { key: key, cert: certificate};
var express     = require('express');
var app         = express();
var socketio    = require('socket.io');
var io;
var https       = require('https');
var httpsServer = https.createServer(credentials, app);

function runServer() {

  // static content webserver
  app.use('/', express.static('./'));

  // logging
  app.use(function (req, res, next) {
    console.info('request:' + req.url);
    next();
  });

  // serv foo
  app.get('/foo', function (req, res) {
    // https://host:port/foo
    res.header("Access-Control-Allow-Origin", "*");
    res.header('foo', 'bar');
    res.send('{"msg": "Hello foo!"}');
  });

  // create secure server 
  httpsServer.listen(443);

  // websocket server
  io = socketio.listen(httpsServer);

  io.on('connection', function (socket) {
    console.info('websocket: %s successfully connected', socket.handshake.address);
    socket.on('disconnect', function (socket) {
      console.info('websocket: %s disconnected', this.handshake.address);
    });
    socket.on('pong', function (data) {
      console.log(data);
      setTimeout(function() {
        socket.emit('ping', '{"msg": "hello"}');
      }, 1000);
    });
    socket.emit('ping');
  });
  console.info('**** SCSW Server up and operational ****');
}

runServer();

})();