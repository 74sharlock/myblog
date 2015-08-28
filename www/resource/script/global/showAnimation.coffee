module.exports = (contentBlock, catId , content)->

	card = @
	cardScope = @parentNode
	cards = cardScope.QA('.content-item')

	cardScope.removeChild(item) for item in cards when item isnt card

	contentBlock.Q('.summary').innerHTML = content
	TweenLite.from(contentBlock.Q('.summary'), 1, {height:20, opacity:0})
	prettyPrint()

	backButton = CE('a')
	backButton.className = 'ui button teal back'
	backButton.href = '/list/' + catId + '.html'
	backButton.setAttribute('data-title', card.data('cat-name'))
	backButton.setAttribute('data-method', 'back')
	backButton.innerHTML = '返回'
	card.appendChild(backButton)

	TweenLite.from(backButton, 0.5, {opacity: 0, rotation: "360deg", x : 100, y: -100})