require('coffee-script/register');

var express = require('express');
var RSVPManager = require('./src/rsvp-manager')

if (!process.env.RDB_AUTHKEY) throw Error('Missing config: RDB_AUTHKEY');
if (!process.env.RETHINK_NAME) throw Error('Missing: process.env.RETHINK_NAME');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('connect-assets')());

// Redirect empty path to root URL. Routing is handled internally via lib>router.js.coffee
app.get('/', function (req, res, next) {
    res.redirect('/rsvp');
});

app.use(function(req, res, next) {
    res.render("app-base");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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


module.exports = app;
