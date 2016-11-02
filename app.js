var express = require('express');
var session = require("express-session")
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SocketServer = require("./libs/SocketServer")

var routes = require('./routes/index');
var users = require('./routes/users');
var home = require("./routes/home")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var Session = session({ 
    secret : "singleseparatormobius",
    resave: false,
    saveUninitialized: true
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Session)
app.use(express.static(path.join(__dirname, 'public')));

//Routing
app.use('/', routes);
app.use('/users', users);
app.use("/home",home)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.injectIO = function (io) {
  io.on("connection", function(socket) {
    console.log("A user connected")
    socket.on("disconnect", function ( ) {
      console.log("A user disconnected")
    })
    socket.on("user.chat",function(data){
      io.emit("user.chat",data)
    })
  })
  SocketServer.injectIO(io)
}

module.exports = app;
