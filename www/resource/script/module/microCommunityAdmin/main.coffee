window.seajs.config #模块配置
  'base': '/resource/script/'
  'alias':
    'wpTooltips': 'plugin/wp_tooltips.js'
    'animationStep': 'plugin/animation_step.js'
    'fileUpload':'global/fileUpload.js'
    'dialog':'plugin/dialog.js',
    'alert':'global/alert'

define (require,exports,module) ->
  mainContainer = document.querySelector('.mainContainer')
  action = if mainContainer then mainContainer.getAttribute('data-action') else null

  if action
    source = 'module/' + window.module + '/' + action + 'Action.js'
    require.async source,(fn) ->
      fn() if fn

  null