#= require lib/base.js.coffee
#= require lib/vm/viewmodel.js.coffee

do ->
   ViewModel = require("lib.vm.ViewModel")

   class PageContentViewModel extends ViewModel
      constructor: (template, title, subtitle) ->
         assertArgs(arguments, optional(String), optional(String), optional(String))
         super(template)
         @controlSetsInternal_ = {}
         @controlSets_ = {}
         @titleInternal_ = ko.observable(title or "")
         @subtitleInternal_ = ko.observable(subtitle or "")
         # Title is either the title set by this view model or bubbles up from a child.
         @title = ko.pureComputed =>
            internalTitle = @titleInternal_()
            return internalTitle if internalTitle and internalTitle.length
            for k, child of @getChildren()
               childTitle = child.title()
               return childTitle if childTitle and childTitle.length
            return ""
         # Subtitle is either the title set by this view model or bubbles up from a child.
         @subtitle = ko.pureComputed =>
            internalSubtitle = @subtitleInternal_()
            return internalSubtitle if internalSubtitle and internalSubtitle.length
            for k, child of @getChildren()
               childSubtitle = child.subtitle()
               return childSubtitle if childSubtitle and childSubtitle.length
            return ""

      setTitle: (title) ->
         assertArgs(arguments, String)
         @titleInternal_(title)

      setSubtitle: (subtitle) ->
         assertArgs(arguments, String)
         @subtitleInternal_(subtitle)


   define('lib.vm.PageContentViewModel', PageContentViewModel)
