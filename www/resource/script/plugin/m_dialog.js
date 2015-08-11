'use strict';

(function (global, factory) {

    if (!global.document) {
        throw new Error('本方法只能在dom环境下使用...');
    }
    //如果存在模块化则模块化处理之
    //不存在模块化时,直接执行
    if (typeof define === 'function') {
        define(factory);
    } else {
        factory(global);
    }
})((typeof window !== 'undefined' ? window : this), function (require,exports,module) {
    var jQuery = window.jQuery || (arguments[0] ? arguments[0]('jquery') : undefined);

    return (function($){

        var toString = Object.prototype.toString;

        var getObjectType = function(everything){
            return toString.call(everything).split('[object ')[1].replace(']','').toLowerCase();
        };

        var isFunction = function(fnName){
            return getObjectType(fnName) === 'function';
        };

        var D = $.M_dialog = function(config){

            D.settings = {
                skin: config.skin || '',
                title:config.title,
                content: config.content || '',
                fastClose:false,
                ok:function(e){
                    if(isFunction(config.ok)){
                        config.ok(D,e);
                    } else {
                        D.close();
                    }
                },
                okValue: config.okValue || '确定',
                cancel: function(e){
                    if(isFunction(config.cancel)){
                        config.cancel(D,e);
                    } else {
                        D.close();
                    }
                },
                cancelValue: config.cancelValue || '取消'
            };

            D.rePos = function(){
                if(D.$node){
                    var w = D.$node.outerWidth(true), h = D.$node.outerHeight(true);
                    D.$node.css({marginLeft:-(w/2), marginTop:-(h/2)});
                }
            };

            $(window).unbind('resize').bind('resize',function(){
                D.rePos();
            });

            D.show = function(){
                if(!$('.m-dialog-body')[0]){
                    var j = createDom();
                    var $node = D.$node = j.node.appendTo('body');
                    var $mask = D.$mask = j.mask.appendTo('body');

                    if(D.settings.ok !== false){
                        $node.find('.ok-btn').on('click', D.settings.ok);
                    }
                    if(D.settings.cancel !== false){
                        $node.find('.cancel-btn').on('click', D.settings.cancel);
                    }
                    D.rePos();
                    $mask.addClass('active');
                    $node.addClass('active');
                    if(D.settings.fastClose === true){
                        $mask.click(function(){
                            D.close();
                        });
                    }
                }
                return D;
            };

            D.close = function(){
                if(D.$node){
                    D.$node.remove();
                    D.$node = null;
                }
                if(D.$mask){
                    D.$mask.remove();
                    D.$mask = null;
                }
                return D;
            };

            function createDom(){
                var $mask = $('<div class="m-dialog-mask"></div>'),
                    s = D.settings,
                    skin = s.skin ? ' ' + s.skin : '',
                    $node = $('<div class="m-dialog-body' + skin + '"></div>'),
                    html = (s.title === false ? '' :'<div class="m-dialog-title">' + s.title + '<i class="close-btn"></i></div>') +
                        '<div class="m-dialog-content'+((config.ok === false && config.cancel === false) ? ' radius' : '')+'">' + s.content + '</div>' +
                        ((config.ok === false && config.cancel === false) ? '' : '<div class="m-dialog-btn-area">' +
                            (config.ok === false ? '' : '<a class="m-dialog-btn ok-btn' + (config.cancel !== false ? ' half-width' : '') + '">' + s.okValue + '</a>') +
                            (config.cancel === false ? '' : '<a class="m-dialog-btn cancel-btn"> ' + s.cancelValue + '</a>') +
                            '</div>');
                $node.html(html);
                return {mask : $mask, node : $node};
            }

            return D;
        };

        D.tips = function(msg,time,callback){
            D({
                title:false,
                ok:false,
                content:msg,
                cancel:false
            }).show();
            setTimeout(function(){
                D.close();
                if(isFunction(callback)){
                    callback();
                }
            },time || 2000);
        };

        D.confirm = function(msg, ok, cancel){
            D({
                title:'提示',
                content:msg,
                ok:ok,
                cancel:cancel
            }).show();
        };

        D.alert = function(msg, ok){
            D.confirm(msg, ok, false);
        };

        return D;
    })(jQuery);
});
