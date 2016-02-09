var express    = require('express');
var path       = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var app        = module.exports = express();
var port       = process.env.PORT || 1337;
var mongoURI   = process.env.MONGO_CONNECTION ||
'mongodb://localhost/test';

app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.set('views', path.join(__dirname, '../views'));

app.use(express.query());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-assets')());
app.use(express.static(path.join(__dirname, '../public')));

// Connect to mongo
conn = mongoose.createConnection(mongoURI);

conn.on('error', function () {
  console.log('Error! Database connection failed.');
});

conn.once('open', function (argument) {
   console.log('Database connection established!');
   app.use(require('./index')(conn));
   app.use(require('./rsvp')(conn));
});
