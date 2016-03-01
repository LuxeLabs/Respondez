var express    = require('express');
var path       = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var app        = module.exports = express();
var favicon    = require('serve-favicon');

app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.set('views', path.join(__dirname, '../views'));

app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(express.query());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-assets')());
app.use(express.static(path.join(__dirname, '../public')));

app.use(require('./index')());
app.use(require('./rsvp')());
