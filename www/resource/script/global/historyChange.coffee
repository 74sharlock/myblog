module.exports = ()->
	window.addEventListener 'popstate',(e)->
		data = history.state
		if data
			require('./articleListAnimation.js')(D('articleList'), data.content)
			document.title = data.title

			labelList = Q('[data-action="labelList"]')

			if data.index isnt 'none'

				if data.index is 'index'
					labelList.Q('.active').removeClass('active') if labelList.Q('.active')
					labelList.Q('.line').addClass('hidden')

				else if parseInt(data.index) isnt NaN

					labelList.Q('.active').removeClass('active') if labelList.Q('.active')
					labelList.QA('.li')[data.index].addClass('active') if labelList.QA('.li')[data.index]
					labelList.Q('.line').style.top = data.index * 77 + 'px'