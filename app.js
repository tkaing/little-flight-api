const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const nocache = require('nocache');
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

// express cors
/*const cors = function (request, response, next) {
    const whitelist = [
        'http://localhost:3000/',
        'http://127.0.0.1:3000/',
    ];
    const origin = request.headers.origin;
    if (whitelist.indexOf(origin) > -1)
        response.setHeader('Access-Control-Allow-Origin', origin);
    next();
}*/
app.use(cors());
app.use(nocache());

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

module.exports = app;
