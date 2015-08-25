module.exports = (nodeScope, newChildrenContent)->

	newChildrenAnimation = ()->
		@innerHTML = newChildrenContent
		items = @QA('a')
		TweenLite.from item, 0.5, {
			x: -300
			opacity: 0
			ease: Back.easeOut.config(1.5)
			onComplete: ()->

		} for item in items

	if nodeScope
		items = nodeScope.QA('a')

		if items.length

			TweenLite.to item, 0.5, {
				x: 300
				opacity: 0
				ease: Back.easeIn.config(1.5)
				onComplete: newChildrenAnimation.bind(nodeScope)

			} for item in items

		else

			newChildrenAnimation.call(nodeScope)

