var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rsvpSchema = new Schema({
   name: String,
   attending: { type: Boolean },
   not_attending: { type: Boolean },
   confirmed_invites: { type: Number, min: 0 },
   created_at: { type: Date }
});

rsvpSchema.pre('save', function(next) {
   var self = this;

   var currentDate = new Date();
   self.updated_at = currentDate;
   if (!self.created_at)
      self.created_at = currentDate;
   next();
});

module.exports = mongoose.model('RSVP', rsvpSchema);
