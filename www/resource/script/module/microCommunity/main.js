window.seajs.config({ //模块配置
    'alias': {
        'animationStep': 'plugin/animation_step.js'
    }
});

define(function (require, exports, module) {

    var mainContainer = document.querySelector('.mainContainer'),
        mainContainerMask = document.querySelector('.mainContainer-mask'),
        action = mainContainer ? mainContainer.getAttribute('data-action') : null,
        isPhone = require('global/isPhone')();
    if (action) {
        var source = 'module/' + window.module + '/' + action + 'Action.js';
        require.async(source, function (fn) {
            mainContainerMask.style.display = 'none';
            if (fn) {
                fn();
            }
        });
    }

    var $ = require('$');

    if (!isPhone) {
        $('body').attr('style', 'background-color: #F1F1F1;-webkit-user-select: inherit;max-width: 640px;margin: 0 auto;overflow-x: hidden;');
        if(window !== top){
            $('.mainContainer-bottom-fixed').css({'left': '50%','margin-left': -($('body').outerWidth(true) / 2)});
        } else {
            $('.mainContainer-bottom-fixed').css({'left': '50%','margin-left': -320});
        }
    }

    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > 0) {
        $("span[data-src]").click(function () {
            var srcList = [],
                src = $(this).data('src'),
                $parent = $(this).parent(),
                $span = $('span', $parent),
                i = 0,
                len = $span.length;
            for (; i < len; i++) {
                srcList.push($span.eq(i).data('src'));
            }
            if (WeixinJSBridge) {
                WeixinJSBridge.invoke('imagePreview', {
                    'current': src,
                    'urls': srcList
                });
            }
        });
    } else {
        require('plugin/jquery.touchTouch.js');
        $('.topics-image-list span[data-src]').touchTouch();
    }
});