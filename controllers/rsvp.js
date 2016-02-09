var express    = require('express');
var app        = express();
var connection = null
var mongoose   = require ('mongoose');

module.exports = function (conn) {
   connection = conn;
   return app;
};

app.post('/rsvp/create', function (req, res, next) {
   var rsvpSchema = new mongoose.Schema({
      name: String,
      email: { type: String, trim: true },
      num_attending: { type: Number, min: 0 }
   });
   var RSVP = mongoose.model('RSVP', rsvpSchema);
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
