module.exports = Controller("Article/BaseController", ->
	'use strict'
	indexAction: (cid) ->
		self = @
		if not isNaN(parseInt(cid))
			D('article').query('select *,(select cat_name from that_article_cat where that_article.cat=that_article_cat.cid) as cat_name from that_article where (`cat` = ' + cid + ') ORDER BY modifytime DESC')
			#.page(if isNumber(parseInt(@post('pageIndex'))) then @post('pageIndex') else 1).order('modifytime DESC').select()
			.then((data)->

				self.assign('list', data)
				self.fetch('chips/articleList.html').then((content)->
					if self.isPost() is no
						self.assign(
							chipArticleList: content
						)
						self.display()
					else
						self.success(
							content:content
						);
				)
			)
		else
			self.redirect('/')

	showAction: (aid)->
		self = @
		if not isNaN(parseInt(aid))
			D('article').query('select *,(select cat_name from that_article_cat where that_article.cat=that_article_cat.cid) as cat_name from that_article where (`id` = ' + aid + ') LIMIT 1')
			.then((data)->

				data = data[0]

				self.assign(
					module : 'index'
					item : data
				)

				if self.isPost() is no
					self.display()
				else
					self.success(
						content:data['content']
					);
			)
		else
			self.redirect('/')
)