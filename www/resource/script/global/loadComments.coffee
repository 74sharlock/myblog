commentsPluginApi = require('../map/api.js')['commentsPluginApi']

module.exports = ()->

	div = CE('div')
	div.className = 'that-comments-block'
	div.innerHTML = '<div class="ui horizontal divider">COMMENTS</div><div id="uyan_frame"></div>'
	@appendChild(div)

	if D('commentsPlugin')

		window['UYAN'].init()

	else

		script = CE('script')
		script.type = 'text/javascript'
		script.src = commentsPluginApi
		script.id = 'commentsPlugin'
		document.body.appendChild(script)



