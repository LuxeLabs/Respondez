#= require lib/base.js.coffee

do ->
   class ViewModel
      constructor: (template) ->
         assertArgs(arguments, optional(String))
         @template = ko.observable(template or null)
         @hasTemplate = ko.pureComputed => @template() != null
         @parent_ = ko.observable()
         @children_ = {}
         @childrenObservable_ = ko.observableArray()

      getParent: ->
         return @parent_()

      getChildren: ->
         return @childrenObservable_()

      getChild: (key) ->
         assertArgs(arguments, String)
         return @getChildObservable(key)()

      getChildObservable: (key) ->
         assertArgs(arguments, String)
         @children_[key] = ko.observable(null) unless @children_[key]
         return @children_[key]

      getKeyForChild: (child) ->
         assertArgs(arguments, ViewModel)
         for key, childObservable of @children_
            return key if childObservable() == child
         return null
         
      setChild: (key, viewModel) =>
         assertArgs(arguments, String, [null, ViewModel])
         if @children_[key]
            old = @children_[key]()
            @children_[key](viewModel)
            # Notify old child view model and parent view model.
            if old
               old.removedFromParent(@, key)
               @childRemoved(old, key)
               @childrenObservable_.remove(old)
         else
            @children_[key] = ko.observable(viewModel)

         @childrenObservable_.push(viewModel) if viewModel
         #  Notify new child view model and parent view model.
         if viewModel
            viewModel.addedToParent(@, key) 
            @childAdded(viewModel, key)

      ### Called every time a child is added to the parent. ###
      childAdded: (child, key) ->
         assertArgs(arguments, ViewModel, String)

      ### Called every time a child is removed. ###
      childRemoved: (child, key) ->
         assertArgs(arguments, ViewModel, String)

      ### Called every time a view model is removed from its parent. ###
      removedFromParent: (parent, key) ->
         assertArgs(arguments, ViewModel, String)
         @parent_(null) if @parent_() == parent

      ### Called every time a view model is added to a parent. ###
      addedToParent: (parent, key) ->
         assertArgs(arguments, ViewModel, String)
         # If the child already has a parent, remove the child from that parent.
         if oldParent = @parent_()
            oldParent.setChild(key, null) if key = getKeyForChild(@)
         @parent_(parent)

      ### Called every time a view model is bound to a view. ###
      boundToElement: (element) ->
         assertArgs(arguments, Element)

      ### Called every time a view model is unbound from a view. ###
      unboundFromElement: (element) ->
         assertArgs(arguments, Element)


   define('lib.vm.ViewModel', ViewModel)
