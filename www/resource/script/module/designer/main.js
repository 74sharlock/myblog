window.seajs.config({ //模块配置
    'base': '/resource/script/',
    'alias': {
        'wpTooltips': 'plugin/wp_tooltips.js',
        'animationStep': 'plugin/animation_step.js',
        'sceneAttrPanel': 'plugin/scene_attr_panel.js',
        'dataQuery': 'module/' + window.module + '/data_query.js',
        'getController': 'module/' + window.module + '/getController.js',
        'serve': 'module/' + window.module + '/controller_serve.js',
        'tinyScrollBar':'plugin/jquery.tinyscrollbar.js',
        'discreteness':'plugin/discreteness.js',
        'dialog':'plugin/dialog'
    }
});

window.htmlCache = {};

define(function (require, exports, module) {
    seajs.use('bsJs');
    require('wpTooltips');
    require('getController');

    var $ = require('jquery');

    $(function () {
        var $wpTooltipsTargets = $('[data-toggle="wpTooltips"]'),
            wpTooltipsTargetsLength = $wpTooltipsTargets.length,
            $controllers = $('[data-controller]'),
            controllersLength = $controllers.length;

        while (wpTooltipsTargetsLength--) {
            var item = $wpTooltipsTargets.eq(wpTooltipsTargetsLength), tips = item.data('tips');
            item.wpTooltips(tips);
        }

        while(controllersLength--){
            $controllers.eq(controllersLength).getController();
        }

    });
});