module.exports = (nodeScope)->
	As = @actions

	isShowing = no

	prettyPrint()

	showList = D('articleList')
	cards = showList.QA('.content-item')

	thisService = {
		link:(target)->

			if not isShowing

				self = @
				isShowing = yes

				loading = CE('div')
				loading.className = 'ui inverted dimmer transition visible active'
				loading.innerHTML = '<div class="ui active loader"></div>'
				contentBlock = @Q('.this-content')
				contentBlock.appendChild(loading)

				href = target.href
				title = target.title
				catId = target.data('cat')

				require('../../global/getContent.js')(href, title, 'none', yes, (content)->
					contentBlock.removeChild(loading)
					contentBlock.Q('.summary').innerHTML = content
					backButton = CE('a')
					backButton.className = 'ui button teal back'
					backButton.href = '/list/' + catId + '.html'
					backButton.setAttribute('data-title', self.data('cat-name'))
					backButton.innerHTML = '返回'
					self.appendChild(backButton)
					TweenLite.from(backButton, 0.5, {opacity : 0, rotation:"180deg", skewX:"30deg"}, 1)
				)

		back:(target)->
			title = target.data('title')
			href = target.href

			dataWaiter = new (require('../../global/dataWaiter.js'))()
			dataWaiter.show()
			require('../../global/getContent.js')(href, title, 'none', no, ()->
				dataWaiter.close()
				isShowing = no
			)
	}

	handler = (e)->
		e.preventDefault()

		target = e.target
		method = target.data('method')
		thisCard = card for card in cards when card is target or card.contains(target)

		if thisCard and method
			thisService[method].call(thisCard,target)


	showList.on 'click', handler if showList