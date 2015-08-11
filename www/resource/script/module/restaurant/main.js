(function () {
    window.mobileDomain = '/CanYin';
    window.seajs.config({
        'base': '/resource/script/',
        'alias': {
            'alert': 'global/alert'
        }
    });

    define(function(require, exports, module) {

        var action, mainContainer, source, isPhone = require('global/isPhone')(), G;

        var domain = 'CanYin';

        G = window[window.module];

        G['share'] = function(){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('micromessenger') > 0) {
                require('global/wxShare').show();
            } else {
                var share = require('global/share.js');
                share.shareConfig = {
                    summary: location.href
                };
                share.show();
            }
        };

        G['isPhone'] = function(){
            return require('global/isPhone')();
        };

        G['click'] = function(){
            return G.isPhone ? 'touchend' : 'click';
        };

        if(isPhone){
            (function(){
                if (/ucbrowser/i.test(navigator.userAgent) ) {
                    return;
                }
                 
                var clientWidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
                if(clientWidth > 640) clientWidth = 640;
                document.documentElement.style.fontSize = clientWidth * (1/20)+"px";
                G['windowWidth'] = clientWidth;
                G['rootFontSize'] = clientWidth * (1/20);
            })();
        }

        mainContainer = document.querySelector('[data-action]');
        action = mainContainer ? mainContainer.getAttribute('data-action') : null;
        if (action) {
            source = 'module/' + window.module + '/' + action + 'Action.js';
            require.async(source, function(fn) {
                if (fn) {
                    return fn();
                }
            });
        }

        return null;
    });

}).call(this);
