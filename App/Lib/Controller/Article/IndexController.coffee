module.exports = Controller("Article/BaseController", ->
	'use strict'
	indexAction: (cid) ->
		self = @
		if not isNaN(parseInt(cid))
			D('article').where({cat: cid}).page(if isNumber(parseInt(@post('pageIndex'))) then @post('pageIndex') else 1).order('modifytime DESC').select().then((data)->

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
			D('article').where({cat: parseInt(http.get['aid'] or http.post['aid'])}).find().then((data)->

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