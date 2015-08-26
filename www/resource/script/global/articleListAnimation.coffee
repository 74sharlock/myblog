module.exports = (nodeScope, newChildrenContent)->

	a = (method, items, ease, x, fn)->
		TweenLite[method](item, 0.5,{
			x: x
			opacity: 0
			ease: ease
			onComplete: fn
		}) for item, index in items

	newChildrenAnimation = ()->
		@innerHTML = newChildrenContent
		items = @QA('.content-item')

		a 'from', items, Back.easeOut.config(1.5), -600, null

	if nodeScope
		items = nodeScope.QA('.content-item')

		if items.length

			a 'to', items, Back.easeIn.config(1.5), 600, newChildrenAnimation.bind(nodeScope)

		else

			newChildrenAnimation.call(nodeScope)

