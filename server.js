//***Dependencies***
//NPM Modules
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');
var https = require('https');

//***Dependencies***



//***Database Connection***
mongoose.connect('mongodb://localhost/taiga');
//mongoose.connect('mongodb://g0lem:SF4phakPnXGunDSnhnWLxzWy@ds111798.mlab.com:11798/taiga-db');
require("./models/user");
require("./models/room");

var User = mongoose.model('User');
var Room = mongoose.model('Room');

//***Database Connection***


//***App Configuration***
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
//***App Configuration***



//***Server Start***
var server = app.listen(process.env.PORT || 8000, function(){
  console.log("App is listening on http://localhost:%d", server.address().port);
});

// var keys_dir = 'keys/';
// var server_options = {
//   key  : fs.readFileSync(keys_dir + 'privatekey.pem').toString(),
//   ca   : fs.readFileSync(keys_dir + 'certauthority.pem').toString(),
//   cert : fs.readFileSync(keys_dir + 'certificate.pem').toString()
// }

// var server = https.createServer(server_options, app).listen(process.env.PORT || 8000, function(){
  
//   console.log("App is listening on http://localhost:%d", server.address().port);

// });

var io = require('socket.io')(server);
//***Server Start***

//***Taiga Modules***
var Auth = require('./taiga_modules/auth');

var auth = new Auth(User);

var account = require("./taiga_modules/account");
account(app, auth, mongoose);


var upload = require("./taiga_modules/upload");
upload(app, auth, mongoose, io);


var graph = require("./taiga_modules/graph");
graph(app, auth, mongoose, io);


var routes = require("./taiga_modules/routes");
routes(app, auth, __dirname);


var sockets = require("./taiga_modules/sockets");
sockets(mongoose, io);
//***Taiga Modules***



//***App Status Configuration***
app.use(function(req, res, next){

  if(res.status(404)){
    res.send("404");
  }

});
//***App Status Configuration***




//***adding rooms if we cleaned up the database***
// var roomtesting = new Room({ roomname: "jojos-bizzare-adventure" , prettyname: "JoJo's Bizzare Adventure", messages:[] });
// roomtesting.save();
// var roomtesting = new Room({ roomname: "world-of-warcraft" , prettyname: "World of Warcraft", messages:[] });
// roomtesting.save();
// var roomtesting = new Room({ roomname: "breaking-bad" , prettyname: "Breaking Bad", messages:[] });
// roomtesting.save();
