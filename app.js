const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { closePoolConnections } = require('./helpers/db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const handleShutdown = () => {
  console.log('Shutting down gracefully...');
  // clearCache();
  closePoolConnections();
};

process.once('SIGINT', () => {
  console.log('SIGINT received.');
  handleShutdown();
  process.exit(0); // Explicitly exit after shutdown
});

process.once('exit', () => {
  console.log('Process exit received.');
  handleShutdown();
});

process.once('SIGTERM', () => {
  console.log('SIGTERM received.');
  handleShutdown();
  process.exit(0); // Explicitly exit after shutdown
});

module.exports = app;
