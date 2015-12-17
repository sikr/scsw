/*
 * SCSW - Skeleton of a secure (https) client with websocket
 */
$(function() {


'use strict';

var socket = io.connect('https://' + location.hostname);

socket.on('ping', function (data) {
  console.log(data);
  window.setTimeout(function() {
    socket.emit('pong', '{"msg": "hello"}');
  }, 1000);
});

var getFoo = function(bar, callback) {
  $.getJSON(location.href + 'foo?bar=' + bar, {}, function cb(result) {
    if (callback) {
      callback(result);
    }
  });
};

$('#b1').click(function result() {
  getFoo('baz', function(data) {
    $('#b1').append(', ' + data.msg);
  });
});

});