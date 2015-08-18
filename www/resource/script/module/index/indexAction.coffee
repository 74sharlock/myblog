define((require, exports, module) ->
	()->
		G = window[window.module]
		As = G.actions

		isSubmitting = no

		btn = D('btn')

		D('btn').on click, ()->
			self = @
			if not isSubmitting
				isSubmitting = yes;
				self.addClass 'disabled'
				window.history.pushState null, '首页', '/'

				queryData '/', {}, (data)->
					console.log(data.data.content)
					isSubmitting = no
					self.removeClass 'disabled'



)