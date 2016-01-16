#= require ../lib/base.js.coffee
#= require ../lib/vm/page-content-viewmodel.js.coffee
#= require ../lib/router.js.coffee

do ->

   PageContentViewModel = require("lib.vm.PageContentViewModel")
   router = require("lib.Router.Instance")

   class App extends PageContentViewModel
      constructor: (rsvpManager) ->
         super()
         @rsvpManager = rsvpManager

      setContent: (viewModel) ->
         assertArgs(arguments, PageContentViewModel)
         @setChild("main", viewModel)

   define("App.Instance", new App())
