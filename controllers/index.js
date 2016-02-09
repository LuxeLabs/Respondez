var express = require('express');
var app = express();
var connection = null

module.exports = function (conn) {
   connection = conn;
   return app;
};

app.get('/', function (req, res, next) {
   res.render('index');
});

app.get('/success', function (req, res, next) {
   res.render('success')
});
