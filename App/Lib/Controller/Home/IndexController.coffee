module.exports = Controller("Home/BaseController", ->
	"use strict"
	indexAction: ->
		self = @
		D('article').page(if isNumber(parseInt(@post('pageIndex'))) then @post('pageIndex') else 1).order('modifytime DESC').select().then((data)->
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
						self.assign('chipArticleList', content)
						self.display()
					else
						self.success(
							content:content
						);
				)
			)
		)

	letAddAction: ->
		self = @
		@session('memberInfo').then((data) ->
			if data isnt undefined and data['mid'] is 0
				self.assign('author', data['name'])
				self.assign('scriptActive', no)
				self.display()
			else
				self.redirect('/wannerAdd')
		)

	wannerAddAction: ->
		self = @
		D('article_cat').query('select *,(select COUNT(0) from that_article where that_article_cat.cid=that_article.cat) as len from that_article_cat').then( (data)->
			self.assign({catList: data});
			self.fetch('chips/index_cat_list.html').then( (content)->
				self.catListContent = content;
				self.assign({catListContent: content});
				self.assign({module:'index'});
				self.display()
			)
		)

	checkAction: ->
		psw = @post('password').trim()
		self = @
		D('user').where(
			id: 1
			password: md5(psw)
		).find()
		.then((data) ->
			if isEmpty(data)
				self.error(403, '密码不对')
			else
				self.session('memberInfo',{
					mid:0,
					name:data['username']
				})
		)
		.then( ->
			self.success()
		)
	logOutAction: ->
		self = @
		@session().then(->
			self.redirect('/')
		)
	addAction: ->
		postData = @post()
		self = @
		thisTime = now()
		postData['createtime'] = thisTime
		postData['modifytime'] = thisTime
		D('article').add(postData).then((id)->
			console.log(id)
			self.redirect('/')
		)
)
