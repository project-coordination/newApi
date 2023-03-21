var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var cors = require('cors');

// Connection à mongo Db
mongoose.connect("mongodb+srv://mohamedoum2430:gIoD7iAoYpCfjg6N@cluster0.3ogttax.mongodb.net/?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true});


db = mongoose.connection;
db.on('error', console.error.bind(console, 'Echec de connection:'));
db.once('open', function() {
  console.log("Connecté à la base de données de BorsaApp")
});


var usersRouter = require('./routes/users');
var transporteurRouter = require('./routes/transporteur');
var demandeCoursesRouter = require('./routes/demandeCourses');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/transporteur', transporteurRouter);
app.use('/demandeCourses', demandeCoursesRouter);


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
