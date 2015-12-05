var express = require('express');
var path = require('path');
var app = express();
var server = app.listen(process.env.PORT || 4000);
var socketConnection = require('socket.io')(server);
var communicator = require('./server/communication/Communicator');
var ShareJS = require('share').server   
var ShareJSOpts = {
    cors: "*",
    db: {type: "none" }
};

ShareJS.attach(app, ShareJSOpts);

app.use(app.router);

app.get('/', function(req, res) {
	communicator(socketConnection);
	res.end('connected');
});

/* exports */
module.exports = app;