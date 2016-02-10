var express    = require('express');
var app        = express();
var connection = null
var mongoose   = require('mongoose');
var RSVP       = require('../models/rsvp_model.js');

module.exports = function (conn) {
   connection = conn;
   return app;
};

app.post('/rsvp', function (req, res, next) {

   var rsvp = new RSVP({
      name: req.body.name,
      email: req.body.email,
      num_attending: req.body.num_attending
   });

   rsvp.save(function (err) {
      if (err) console.log ('Error on save!')
      res.redirect('/success');
   });
});
