module.exports = Controller("Article/BaseController", ->
	'use strict'
	indexAction: (cid) ->
		self = @
		if not isNaN(parseInt(cid))
			D('article').where({cat: cid}).page(if isNumber(parseInt(@post('pageIndex'))) then @post('pageIndex') else 1).order('modifytime DESC').select().then((data)->

				self.session('memberInfo').then((s)->
					if not isEmpty(s)
						self.assign('user',
							name: s.name
							id: s.mid
						)
					else
						self.assign('user', {})

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
			)
		else
			self.redirect('/')
)