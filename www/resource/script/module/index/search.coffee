module.exports = (nodeScope)->

	input = nodeScope.Q('input');

	handler = [focusHandler, blurHandler] = [
		()->nodeScope.addClass('focus')
		()->nodeScope.removeClass('focus')
	]

	event = ['focus', 'blur']

	input.on(eve,handler[index]) for eve, index in event
