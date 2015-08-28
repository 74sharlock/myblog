module.exports = (nodeScope)->

	that = @

	prettyPrint()

	showList = D('articleList')

	getContent = require('../../global/getContent.js')

	thisService = {
		link: (target)->
			if not that.isShowing

				self = @
				that.isShowing = yes

				loading = CE('div')
				loading.className = 'ui inverted dimmer transition visible active'
				loading.innerHTML = '<div class="ui active loader"></div>'
				contentBlock = @Q('.this-content')
				contentBlock.appendChild(loading)

				href = target.href
				title = target.title
				catId = self.data('cat')

				getContent.call(that, href, title, yes, {}, (content)->
					contentBlock.removeChild(loading)
					require('../../global/showAnimation').apply(self, [contentBlock, catId, content])
				,{card: self.outerHTML})

		back: (target)->
			title = target.data('title')
			href = target.href

			dataWaiter = new (require('../../global/dataWaiter.js'))()
			dataWaiter.show()
			getContent.call(that, href, title, no, ()->
				dataWaiter.close()
			)
	}

	handler = (e)->
		e.preventDefault()
		cards = showList.QA('.content-item')
		target = e.target
		method = target.data('method')
		thisCard = card for card in cards when card is target or card.contains(target)

		if thisCard and method
			thisService[method].call(thisCard, target)


	showList.on 'click', handler if showList