module.exports = ()->
	window.addEventListener 'popstate',(e)->

		data = history.state
		href = location.href
		hostName = location.hostname
		labelList = Q('[data-action="labelList"]')

		@isShowing = no

		document.title = data.title +  + '-Sharlock\'s blog' if data

		switch
			when href.indexOf('list') > 0
				if data and data.other and data.other.index

					text = data.content

					labelList.Q('.active').removeClass('active') if labelList.Q('.active')

					if labelList.QA('li')[data.other.index]

						labelList.QA('li')[data.other.index].addClass('active')
						TweenLite.to(labelList.Q('.line'), 0.35, { top : (data.other.index * 77) + 'px',  ease: Bounce.easeOut})

			when href.indexOf('show') > 0
				if data
					text = data.other.card

			when href is hostName
				Q('.avatar').click()
				labelList.Q('.line').addClass('hidden')

		require('./articleListAnimation.js')(D('articleList'), text) if text