define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        $.fn.getController = function(options){
            var that = this,
                module = window.module,
                hasAnimation = that.data('toggle') === 'animationStep',
                controller = that.data('controller'),
                serve = that.data('controllerServe'),
                controllerView = that.data('controllerView') || '/resource/views/' + module + '/' + controller + '.html';

            options = $.extend({
                controller : controller,
                serve:serve,
                controllerView:controllerView
            },options);

            if(options.controller){
                $.get(options.controllerView,function(data){
                    that.html(data);
                    if(hasAnimation){
                        require('animationStep');
                        that.animationStep();
                    }
                    if(options.serve){
                        require('serve')[serve](that);
                    }
                    if(that.find('[data-foreach][data-api]')[0]){
                        require('dataQuery');
                        //todo:移除测试方法
                        var $foreach = that.find('[data-foreach]'),
                            dataModel = $foreach.data('foreach'),
                            z = $foreach.length,
                            api = require('api')[$foreach.data('api')] || require('module/designer/test-data')[dataModel],
                            getDataMethod = $foreach.data('getMethod') || 'get';
                        if(dataModel && api){
                            //todo:$[getDataMethod](api,function(){})
                            while(z--){
                                $foreach.eq(z).getView(api,$foreach.eq(z).data('action'));
                            }
                        }

                    }
                    if(that.find('[data-controller]')[0]){
                        var $childController = that.find('[data-controller]'), l = $childController.length;
                        while(l--){
                            $.fn.getController.call($childController.eq(l),options);
                        }
                    }
                });
            }
            return that;
        };
    })($);
});
