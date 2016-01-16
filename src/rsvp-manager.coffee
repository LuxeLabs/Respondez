insist = require("insist-types")
r = require("rethinkdb")

class RSVPManager

   constructor: (rethinkdb) ->
      insist.args(arguments, Object)
      @rethinkdb = rethinkdb

   createReservation: (data, callback) ->
      reservation = {
         first_name: data.first_name
         last_name: data.last_name
         email: data.email or null
         phone_number: data.phone_number or null
         is_attending: data.is_attending
         party_size: data.party_size
      }
      r.table('reservations').insert(data, { returnChanges: true })
      .run @rethinkdb, (err, data) ->
         return callback(err) if err
         callback(null, data.changes[0].new_val)

module.exports = RSVPManager
