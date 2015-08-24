module.exports = Controller(->
	'use strict'
	init: (http)->
		@super 'init', http
		self = @
		D('article_cat').select().then( (data)->
			self.assign({catList: data, thisCId:parseInt(http.get['cid'] or http.post['cid'])});
			self.fetch('chips/index_cat_list.html').then( (content)->
				self.catListContent = content;
				self.assign({catListContent: content});
			)
		)

	__before:(action)->
		@assign(
			title : action
			module : action
			scriptActive: yes
		)

)