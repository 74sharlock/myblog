module.exports = (nodeScope)->


	ul = nodeScope.Q('ul')
	lis = ul.QA('li')
	line = nodeScope.Q('.line')
	h = parseInt(getComputedStyle(line)['height'])

	handler = (e)->

		target = e.target
		type = e.type
		curLi = ul.Q('.active')
		curIndex = if curLi then curLi.index() or 0

		thisLi = item for item in lis when item.contains(target) or item is target

		if thisLi

			index = thisLi.index()

			if type is 'click' or type is 'touchend'

				e.preventDefault()
				li.removeClass('active') for li in lis
				thisLi.addClass('active')

			else

				TweenLite.to(line, 0.35, { top : (index * h) + 'px',  ease: Bounce.easeOut}) if type is 'mouseover'
				TweenLite.to(line, 0.35, { top : (curIndex * h) + 'px',  ease: Bounce.easeOut}) if type is 'mouseout'

	event = ['mouseover', click, 'mouseout']

	ul.on eve, handler for eve in event