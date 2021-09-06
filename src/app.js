const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const nocache = require('nocache');

const indexRouter = require('./routes');
const {renderError} = require("./helpers/error-handler.helper");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
console.log('static path: ', path.join(__dirname, 'public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'events',
  defaultLayout: 'home'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(nocache());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Uh Oh!!!'));
});

// error handler
app.use(function(err, req, res, next) {
  err.env = req.app.get('env');
  renderError(res, err);
});

module.exports = app;
