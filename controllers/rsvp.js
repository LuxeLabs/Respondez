var express    = require('express');
var app        = express();
var connection = null
var mongoose   = require('mongoose');
var client     = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var sendgrid   = require('sendgrid')(process.env.SENDGRID_KEY);
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

   client.sendMessage({
       to:'+19139910274',
       from: process.env.TWILIO_PHONE,
       body: req.body.name + ' just RSVP\'d with a party size of ' + req.body.num_attending
   }, function(err, responseData) {
       if (!err) {
           console.log(responseData.from);
           console.log(responseData.body);
       }
   });

   sendgrid.send({
      to:       'addisonshaw93@gmail.com',
      from:     'wedding@rsvp.xxx',
      subject:  'Someone RSVP\'d!',
      text:     req.body.name + ' just RSVP\'d with a party size of ' + req.body.num_attending
   }, function(err, json) {
         if (err) { return console.error(err); }
            console.log(json);
   });

   rsvp.save(function (err) {
      if (err) console.log ('Error on save!')
      res.redirect('/success');
   });
});
