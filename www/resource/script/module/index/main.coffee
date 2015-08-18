define((require, exports, module)->

	G = window[window.module]
	G.actions = {}
	actionContainer = document.querySelectorAll('[data-action]');
	len = actionContainer.length
	while len--
		item = actionContainer[len]
		action = item.getAttribute('data-action')
		if action
			G.actions[action] = {}
			source = 'module/' + window.module + '/' + action + 'Action.js'
			require.async(source, (fn) ->
				return fn() if fn
			)
	null
)