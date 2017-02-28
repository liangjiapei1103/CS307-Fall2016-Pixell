var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var signedCookieParser = cookieParser('pixell');
var Cookie = require('cookie');
var multiparty = require('connect-multiparty');
var multimidd = multiparty();
var flash = require('req-flash');
// var aws = require('aws-sdk');
// var userController = require('./app/controllers/user')

var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
var SocketIo = require('socket.io');
var routes = require('./routes');
var port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/'));
// app.set('view engine', 'ejs');
// app.set('view engine', 'html');
// app.engine('html', require('ejs').renderFile);

// app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(multimidd);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(multimidd);

var sessionStore = new MongoStore({
    url: process.env.MONGODB_URI || 'mongodb://heroku_dx50wn59:fa1v80d9utmla08og3pdfpaol2@ds023245.mlab.com:23245/heroku_dx50wn59',
    autoRemove: 'native'
})

app.use(session({
    secret: 'pixell',
    key: 'db',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 days
    resave: true,
    saveUninitialized: false,
    store: sessionStore
}));
app.use(flash());

routes(app);

console.log('MONGODB_URI: ' + process.env.MONGODB_URI || 'mongodb://heroku_dx50wn59:fa1v80d9utmla08og3pdfpaol2@ds023245.mlab.com:23245/heroku_dx50wn59');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_dx50wn59:fa1v80d9utmla08og3pdfpaol2@ds023245.mlab.com:23245/heroku_dx50wn59', (error) => {
    if (error)
        console.log(error);
    else {
        console.log('mongo connected');
    }
});

const server = app.listen(port, (err) => {
  if (err) {
      console.log(err);
      return;
  }
  console.log("Listening on port " + port);
});

const io = new SocketIo(server, {path: '/chat'})
const socketEvents = require('./socketEvents')(io);
