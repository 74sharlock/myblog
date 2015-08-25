module.exports = Controller(->
	'use strict'
	init: (http)->
		@super 'init', http
		self = @
		D('article_cat').query('select *,(select COUNT(0) from that_article where that_article_cat.cid=that_article.cat) as len from that_article_cat').then( (data)->
			self.assign({catList: data, thisCId:parseInt(http.get['cid'] or http.post['cid'])});
			self.fetch('chips/index_cat_list.html').then( (content)->
				self.catListContent = content;
				self.assign({catListContent: content});
			)
		)
		self.session('memberInfo').then((s)->
			if not isEmpty(s)
				self.assign('user',
					name: s.name
					id: s.mid
				)
			else
				self.assign('user', {})
		)

	__before:(action)->
		@assign(
			title : action
			module : action
			scriptActive: yes
		)

)