if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config({ path: '.env' })
};

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const {rmSync} = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const connectFlash = require('connect-flash');

// Connect to MongoDb
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


// Import Models
const User = require('./models/user');

// Import Routes
const indexRouter = require('./routes/index');

// Initialize App
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Configure the app
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



passport.use(
  new LocalStrategy((username, password, done) => {
      User.findOne({username:username}, (err, user) => {
          if(err) {
              return done(err);
          }
          if(!user) {
              return done(null, false, {message: "Incorrect username"});
          }
          bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                  return done(null, user)
              } else {
                  return done(null, false, {message: "Incorrect password"})
              }
          })
      });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});


// Authentication
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Access the user object from anywhere in our application
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Use Routes
app.use('/', indexRouter);


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
