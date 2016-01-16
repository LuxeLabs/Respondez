#= require vendor/insist.js.ejs
#= require testing.js.coffee.ejs

do (scope = @) ->
   root = {};

   ###
    * Defines a namespace.
    * @param {string} namespace
    * @param {Object} obj
   ###
   scope.define = (namespace, obj) ->
      namespace = namespace.replace(/\./g, '$')
      throw Error("Namespace already exists: #{namespace}") if root[namespace]
      root[namespace] = obj
            
   ###
    * Returns the namespace or throws an error if not found.
    * @param {string} namespace
    * @return {Object} 
   ###
   scope.require = (namespace) ->
      namespace = namespace.replace(/\./g, '$')
      throw Error("Unknown namespace: #{namespace}") unless root[namespace]
      return root[namespace]

   scope.assertArgs = Insist.args
   scope.assertOfType = Insist.ofType
   scope.assertType = Insist.isType
   scope.isValidType = Insist.isValidType
   scope.isOptionalType = Insist.isOptionalType
   scope.getNameForValue = Insist.getNameForValue
   scope.getNameForType = Insist.getNameForType
   scope.isOfType = Insist.isOfType
   scope.arrayOf = Insist.arrayOf
   scope.nullable = Insist.nullable
   scope.anything = Insist.anything
   scope.optional = Insist.optional
