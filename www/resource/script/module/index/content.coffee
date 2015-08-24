module.exports = (nodeScope)->
	As = @actions

	isSubmitting = no

	console.log(As)

	D('btn').on(click, ()->
		self = @;
		if not isSubmitting
			isSubmitting = true;
			self.addClass('disabled');
			queryData('/', {pageIndex:2}, (data)->
				console.log(data.data.content)
				isSubmitting = false;
				self.removeClass('disabled')
			)
	)
