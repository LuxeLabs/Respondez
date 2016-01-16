#= require lib/base.js.coffee
#= require lib/router.js.coffee
#= require rsvp-page.coffee
#= require thank-you-page.coffee
#= require app.coffee

do ->
   Routes = ->

      RSVPPage = require("RSVPPageViewModel")
      ThankYouPage = require("ThankYouViewModel")

      app = require("App.Instance")
      router = require("lib.Router.Instance")

      router.registerRoute "/rsvp", ->
         app.setContent(new RSVPPage())

      router.registerRoute "/thank-you", ->
         app.setContent(new ThankYouPage())

   define('Routes', Routes)
