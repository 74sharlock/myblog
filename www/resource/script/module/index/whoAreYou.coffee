module.exports = (nodeScope)->

	isSubmitting = no

	btn = D('btn')

	if(btn)
		btn.on(click,()->
			self = this;
			if not isSubmitting

				isSubmitting = yes
				self.addClass('disabled')

				queryData '/Home/Index/check', {password: D('psw').value.trim()}, (data)->
					isSubmitting = no
					self.removeClass('disabled')
					if data['errno'] is 0
						window.location.href = '/letAdd'
					else
						alert(data['errmsg'])

		)