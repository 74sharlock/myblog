module.exports = (nodeScope)->


	ul = nodeScope.Q('ul')
	lis = ul.QA('li')
	line = nodeScope.Q('.line')
	h = parseInt(getComputedStyle(line)['height'])

	# todo: 这里不知道为什请求不到模块
	dataWaiter = new require('./global/dataWaiter.js')()

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
				line.removeClass('hidden').style.top = (index * h) + 'px'

				dataWaiter().show()
				url = thisLi.Q('a').href
				queryData url, {}, (res)->
					dataWaiter.close()
					console.log(res['data']['content']);

			else
				if not line.hasClass('hidden')
					if type is 'mouseover'
						i = index
					else if type is 'mouseout'
						i = curIndex
					TweenLite.to(line, 0.35, { top : (i * h) + 'px',  ease: Bounce.easeOut})

	event = ['mouseover', click, 'mouseout']

	ul.on eve, handler for eve in event