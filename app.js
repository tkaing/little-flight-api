const path = require('path');
const logger = require('morgan');
const express = require('express');
const nocache = require('nocache');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const listOfRoutes = require('./api/api_routing');

const firebaseAdmin = require('firebase-admin');
const firebaseCredentials = require("./api/firebase-credentials.json");

// Initialise une instance express
const app = express();

// Paramètres de l'API
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache());

// Configuration de Firebase
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseCredentials)
});

// Liste des routes
listOfRoutes.forEach((it) => app.use(it, require(`./routes/${ it }`)));

// Lance une erreur 404 si la route est introuvable
app.use(function(req, res, next) {
    next(createError(404));
});

// Lance une erreur
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
