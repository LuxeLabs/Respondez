#= require ../lib/base.js.coffee

#= require_tree ../vendor
#= require_tree templates

#= require lib/router.js.coffee
#= require routes.coffee

#= require app.coffee
#= require templates/app-layout.jst.jade

#= require testing.js.coffee.ejs

$(document).ready ->

   # Create the layout DOM.
   $("body").html(JST["app-layout"]())

   RethinkDB = require('rethinkdb')
   RSVPManager = require('./rsvp-manager')

   db = process.env.RETHINK_NAME
   rethinkConfig = { db: db }
   if process.env.NODE_ENV == 'production'
      rethinkConfig['authKey'] = process.env.RDB_AUTHKEY

   RethinkDB.connect rethinkConfig, (err, conn) ->
      throw err if err

      rsvpManager = new RSVPManager(conn)

      # Bind the starting app view model.
      app = require("App.Instance")(rsvpManager)

      ko.applyBindings(app)

      # This must be last because everything needs to be initialized before listen is called.
      require("Routes")()
      router = require("lib.Router.Instance")
      router.listen()
