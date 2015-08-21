module.exports = (nodeScope)->


	ul = nodeScope.Q('ul')

	handler = (e)->

		target = e.target
		type = e.type

		if target isnt @

			if(type isnt 'mouseover')

				e.preventDefault()

	event = ['mouseover', click]

	ul.on eve, handler for eve in event