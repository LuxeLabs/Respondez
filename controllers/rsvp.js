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

   var attending = req.body.attending;
   var not_attending = req.body.not_attending;
   var confirmed_invites = req.body.confirmed_invites;

   if (attending == undefined) {
      attending = false;
      not_attending = true;
      confirmed_invites = 0;
   } else if (not_attending == undefined) {
      attending = true;
      not_attending = false;
   }

   var data = {
      name: req.body.name,
      attending: attending,
      not_attending: not_attending,
      confirmed_invites: confirmed_invites
   }

   var rsvp = new RSVP(data);

   // Only send updates if RSVP is attending.
   if (attending) {
      client.sendMessage({
          to:'+19139910274',
          from: process.env.TWILIO_PHONE,
          body: data.name + ' just confirmed ' + data.confirmed_invites + ' invite(s)!'
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
         text:     data.name + ' just confirmed ' + data.confirmed_invites + ' invite(s)!'
      }, function(err, json) {
            if (err) { return console.error(err); }
               console.log(json);
      });
   } else {
      client.sendMessage({
          to:'+19139910274',
          from: process.env.TWILIO_PHONE,
          body: data.name + ' has declined the invite.'
      }, function(err, responseData) {
          if (!err) {
              console.log(responseData.from);
              console.log(responseData.body);
          }
      });

      sendgrid.send({
         to: 'addisonshaw93@gmail.com',
         from: 'wedding@rsvp.xxx',
         subject: 'Someone declined their invite.',
         text: data.name + ' has declined the invite.'
      }, function(err, json) {
            if (err) { return console.error(err); }
               console.log(json);
      });
   }

   rsvp.save(function (err) {
      if (err) console.log ('Error on save!')
      res.redirect('/success');
   });
});
