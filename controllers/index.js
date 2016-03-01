var express    = require('express');
var app        = express();

module.exports = function () {
   return app;
};

app.get('/', function (req, res, next) {
   res.render('index');
});

app.get('/success', function (req, res, next) {
   res.render('success')
});
