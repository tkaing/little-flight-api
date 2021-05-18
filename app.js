const path = require('path');
const http = require('http');
const spawn = require('child_process').spawn;
const logger = require('morgan');
const express = require('express');
const WebSocket = require('ws');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const listOfRoutes = require('./api/api_routing');

const firebaseAdmin = require('firebase-admin');
const firebaseCredentials = require("./api/firebase-credentials.json");

const app = express();

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// firebase
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseCredentials)
});

// list of routes
listOfRoutes.forEach((it) => app.use(it, require(`./routes/${ it }`)));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const streamServer = http.createServer(function (request, response) {
    // Log that a stream connection has come through
    console.log(
        'Stream Connection on 3001 from: ' +
        request.socket.remoteAddress + ':' +
        request.socket.remotePort
    );
    // When data comes from the stream (FFmpeg) we'll pass this to the web socket
    request.on('data', function(data) {
        // Now that we have data let's pass it to the web socket server
        webSocketServer.broadcast(data);
    });
}).listen(3001);

const webSocketServer = new WebSocket.Server({
    server: streamServer
});

webSocketServer.broadcast = function (data) {
    webSocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

setTimeout(function() {
    var args = [
        "-i", "udp://0.0.0.0:11111",
        "-r", "30",
        "-s", "960x720",
        "-codec:v", "mpeg1video",
        "-b", "800k",
        "-f", "mpegts",
        "http://127.0.0.1:3001/stream"
    ];
    // Spawn an ffmpeg instance
    var streamer = spawn('ffmpeg', args);
    // Uncomment if you want to see ffmpeg stream info
    //streamer.stderr.pipe(process.stderr);
    streamer.on("exit", function(code){
        console.log("Failure", code);
    });
}, 3000);

module.exports = app;
