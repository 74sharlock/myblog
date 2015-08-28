module.exports = (href, title, cst, data, fn, other)->

	self = @

	fn = data if isFunction(data)

	queryData(href, (if getType(data) is 'object' then data else {}), (res)->
		document.title = title + '-Sharlock\'s blog' if title
		content = res['data']['content']

		state =
			content:content
			id:href
			title:title

		state.other = other if other

		history.pushState state, title, href
		fn.call(self, content) if isFunction(fn)

		if not cst
			self.isShowing = no
			require('./articleListAnimation')(D('articleList'), content)

	) if href