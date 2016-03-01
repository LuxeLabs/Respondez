var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var app        = express();
var favicon    = require('serve-favicon');
var port       = process.env.PORT || 1337;

if (!process.env.UPDATE_PHONE) throw Error('Missing: process.env.UPDATE_PHONE');
if (!process.env.UPDATE_EMAIL) throw Error('Missing: process.env.UPDATE_EMAIL');
if (!process.env.TWILIO_PHONE) throw Error('Missing: process.env.TWILIO_PHONE');
if (!process.env.TWILIO_SID) throw Error('Missing: process.env.TWILIO_SID');
if (!process.env.TWILIO_TOKEN) throw Error('Missing: process.env.TWILIO_TOKEN');
if (!process.env.SENDGRID_KEY) throw Error('Missing: process.env.SENDGRID_KEY');
if (!process.env.MONGO_CONNECTION) throw Error('Missing: process.env.MONGO_CONNECTION');

// Jade template setup.
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(express.query());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-assets')());
app.use(express.static(path.join(__dirname, 'public')));

// Import controllers.
app.use(require('./controllers/rsvp')());

// Use basic routes.
app.get('/', function (req, res, next) {
   res.render('index');
});

app.get('/success', function (req, res, next) {
   res.render('success')
});

// Start app
app.listen(port, function () {
  console.log('Listening on ' + port);
});
