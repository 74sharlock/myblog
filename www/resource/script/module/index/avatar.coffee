module.exports = (nodeScope)->

	dataWaiter = new (require('../../global/dataWaiter.js'))()
	title = nodeScope.title
	href = nodeScope.href

	handle = (e)->
		e.preventDefault()

		if href isnt location.href
			dataWaiter.show()

			require('../../global/getContent.js')(href, title, 'index', no, ()->
				dataWaiter.close()
			)

	nodeScope.on('click', handle)