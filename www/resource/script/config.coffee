R(()->

	$('.ui.dropdown').dropdown();

	if CE('div').classList

		window.module = document.body.gas('data-module')

		if window.module

			window[window.module] = {} if typeof window[window.module] is 'undefined'

			G = window[window.module]

			G.actions = {}

			if document.body.gas('data-active') is 'true'

				actionContainer = document.querySelectorAll('[data-action]')
				len = actionContainer.length

				while len--
					item = actionContainer[len]
					action = item.getAttribute('data-action')
					if action
						G.actions[action] = {}
						require('./module/' + window.module + '/' + action + '.js').call(G, item);
				null
)