#= require lib/base.js.coffee
# Based on: http://stackoverflow.com/questions/14738225/routing-knockout-js-app-with-sammy-js-and-history-with-html4-support

do ->
   class Route
      constructor: (path, @callbacks) ->
         assertArgs(arguments, String, arrayOf(Function))
         path = path.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

         # Capture the slugs (/:something) and replace them with regex fragment.
         replaceColon = (slug) -> return slug.substring(2)
         @slugs = (path.match(/\/:(\w+)+/g) or []).map(replaceColon)
         expression = path.replace(/\/:(\w+)+/g, "/([\\w-@.]+)+")
         @regex = new RegExp(expression)

      tryCallback: (url) =>
         assertArgs(arguments, String)
         @regex.lastIndex = 0

         # Extract the path from the url and test against that.
         path = url.replace(/\?.*/, "")
         path = path.substring(0, path.length - 1) if path[path.length - 1] == "/"
         query = url.match(/\?.*/)?[0] or ""
         match = @regex.exec(path)
         if match != null && match[0].length == path.length
            req = {}

            # Add the slugs to the request object.
            if @slugs
               req.params = {}
               req.params[slug] = match[index + 1] for slug, index in @slugs

            # Add the query parameters to the request object.
            if query.length
               req.query = {}
               values = query.match(/[\w=$+%#^()]+/g)
               for value in values
                  split = value.split("=")
                  req.query[split[0]] = split[1] or true

            # Call each callback in order.
            callback(req) for callback in @callbacks
            return true

         return false

   class Router
      constructor: () ->
         @routes = []
         @on404 = (url) -> console.log('404 at', url)
         @historyLength = 0

      registerRoute: (route, callbacks...) ->
         assertOfType(route, String)
         assertOfType(callbacks, arrayOf(Function))
         @routes.push(new Route(route, callbacks))

      ### Starts the router listening. The initial URL is passed through the router immediately. ###
      listen: ->
         window.addEventListener "popstate", (e) =>
            @historyLength--
            @notify_(@currentUrlWithoutOrigin_())

         # Capture all clicks on links. Have to use self because 'this' is the element clicked.
         self = @
         $(document).on "click", "[href]", (e) ->
            href = @getAttribute("href")
            # Let external links behave normally.
            if href.indexOf("http") != 0
               e.preventDefault()
               self.navigate(href)
         @notify_(@currentUrlWithoutOrigin_())

      ### Navigates to the supplied URL. ###
      navigate: (url) ->
         assertArgs(arguments, String)
         return if @addOriginIfNeeded_(url) == window.location.href
         if window.history && window.history.pushState
            history.pushState(null, "", url)
            @historyLength++
            @notify_(url)

      ### Returns a value indicating if there is state to go back to. ###
      hasHistory: ->
         return @historyLength > 0

      ### Navigates to the previous URL. ###
      back: ->
         window.history.back()

      ### Calls the proper callbacks based on the supplied URL. ###
      notify_: (url) ->
         assertArgs(arguments, String)
         for route in @routes
            return if route.tryCallback(url)
         @on404(url)

      ### Gets the current URL without the origin ###
      currentUrlWithoutOrigin_: ->
         return window.location.href.replace(@getOrigin_(), "")

      addOriginIfNeeded_: (url) ->
         return url if url.indexOf("http") == 0
         url = if url[0] == "/" then url else "/#{url}"
         return "#{@getOrigin_()}#{url}"

      ### Returns the current origin. This is pulled out to make testing possible. ###
      getOrigin_: ->
         return window.location.origin


   define('lib.Router', Router)
   define('lib.Router.Instance', new Router())
   define('lib.Router.Route', Route)
