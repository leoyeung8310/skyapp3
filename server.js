var express = require("express");
var path = require('path');
var router = express.Router();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var bcrypt = require('bcrypt-nodejs');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// This is needed for passing values in API
app.use(bodyParser.json({limit: '50mb'})); //unlock limit of http post (payload 413)
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); //unlock limit of http post (payload 413)
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Import MongoDB Schemas
require('./app_api/models/mains');

// MongoDB connection
var config = require('./app_api/config/database');
var dbURI = config.database;
//input dbURI in env variable.
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGODB_URI;
}
mongoose.connect(dbURI, function(err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('Mongoose connected to ' + dbURI);
});

// Initialize the app after MongoDB connection
var server = app.listen(process.env.PORT || 3000, function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("App now running on port", server.address().port);
});

// Socket IO functions
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', { message: data });
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// API Routes for IO
var routeIO = require('./app_api/routes/chat'); //for SocketIO
app.use('/chat', routeIO);

// API Routes for App
var routesApi = require('./app_api/routes/index');
app.use('/api', routesApi);

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
// All others routes point to Angular App (Included Error 404)
app.get('*', function (req, res) {
  res.sendFile(distDir + '/index.html');
});


