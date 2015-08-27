module.exports = (href, title, index, cst, data, fn)->

	self = @

	fn = data if isFunction(data) and not fn

	queryData(href, (if getType(data) is 'object' then data else {}), (res)->
		document.title = title if title
		content = res['data']['content']
		history.pushState {content: content, id:href, title: title, index: index}, title, href
		require('./articleListAnimation')(D('articleList'), content) if not cst
		fn.call(self, content) if isFunction(fn)
	) if href