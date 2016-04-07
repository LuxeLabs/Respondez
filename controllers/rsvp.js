var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var client     = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var sendgrid   = require('sendgrid')(process.env.SENDGRID_KEY);
var RSVP       = require('../models/rsvp_model.js');
var mongoURI   = process.env.MONGO_CONNECTION ||
'mongodb://localhost/test';

module.exports = function () {
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
          to:   process.env.UPDATE_PHONE_2,
          from: process.env.TWILIO_PHONE,
          body: data.name + ' just confirmed ' + data.confirmed_invites + ' invite(s)!'
      }, function(err, responseData) {
          if (!err) {
              console.log(responseData.to);
              console.log(responseData.body);
          }
      });

      client.sendMessage({
          to:   process.env.UPDATE_PHONE,
          from: process.env.TWILIO_PHONE,
          body: data.name + ' just confirmed ' + data.confirmed_invites + ' invite(s)!'
      }, function(err, responseData) {
          if (!err) {
              console.log(responseData.to);
              console.log(responseData.body);
          }
      });

      sendgrid.send({
         to:        [process.env.UPDATE_EMAIL, process.env.UPDATE_EMAIL_2],
         from:      'wedding@rsvp.xxx',
         subject:   'Someone RSVP\'d!',
         text:      data.name + ' just confirmed ' + data.confirmed_invites + ' invite(s)!'
      }, function(err, json) {
            if (err) { return console.error(err); }
               console.log(json);
      });
   } else {
      client.sendMessage({
          to:   process.env.UPDATE_PHONE_2,
          from: process.env.TWILIO_PHONE,
          body: data.name + ' has declined the invite.'
      }, function(err, responseData) {
          if (!err) {
              console.log(responseData.to);
              console.log(responseData.body);
          }
      });

      client.sendMessage({
          to:   process.env.UPDATE_PHONE,
          from: process.env.TWILIO_PHONE,
          body: data.name + ' has declined the invite.'
      }, function(err, responseData) {
          if (!err) {
              console.log(responseData.to);
              console.log(responseData.body);
          }
      });

      sendgrid.send({
         to:       [process.env.UPDATE_EMAIL, process.env.UPDATE_EMAIL_2],
         from:    'wedding@rsvp.xxx',
         subject: 'Someone declined their invite.',
         text:    data.name + ' has declined the invite.'
      }, function(err, json) {
            if (err) { return console.error(err); }
               console.log(json);
      });
   }

   // Connect to mongo
   mongoose.connect(mongoURI);

   var conn = mongoose.connection;

   conn.on('error', function () {
     console.log('Error! Database connection failed.');
   });

   conn.once('open', function (argument) {
      rsvp.save(function (err) {
         if (err) console.log (err);
         res.redirect('/success');
         mongoose.connection.close()
      });
   });
});
