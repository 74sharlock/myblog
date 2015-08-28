module.exports = (nodeScope)->

	that = @

	dataWaiter = new (require('../../global/dataWaiter.js'))()
	title = nodeScope.title
	href = nodeScope.href

	handle = (e)->
		e.preventDefault()

		if href isnt location.href
			dataWaiter.show()

			require('../../global/getContent.js').call(that, href, title, no, {}, ()->
				dataWaiter.close()
			)

	nodeScope.on('click', handle)