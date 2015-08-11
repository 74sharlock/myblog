window.seajs.config({ //模块配置
    'alias': {
        'animationStep': 'plugin/animation_step.js'
    }
});

define(function(require, exports, module){

    var $ = require('jquery'),
        global = require('global');

    if (!global.isPhone()) {
        document.body.style.maxWidth = '480px';
        document.body.style.margin = '0 auto';
    }

    seajs.use(['animationStep'],function(){
        $('[data-toggle="animationStep"]').animationStep();
        $('.mainContainer-mask').hide();
    });

    global.swpier();

    var forum = document.querySelector('.mainContainer'), action = forum ? forum.getAttribute('data-action') : null;

    if(action){
        var source = 'module/' + window.module + '/' + action + 'Action.js';
        require.async(source,function(fn){
            if(fn){
                fn();
            }
        });
    }
});

