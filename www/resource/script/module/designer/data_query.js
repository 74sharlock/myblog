define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        $.fn.getView = function(data,callback){
            var that = this,
                module= window.module,
                dataView = that.data('view') || that.data('foreach'),
                id = '/resource/views/' + module + '/' + dataView + '.html';
            if(window['htmlCache'][dataView]){
                if(data){
                    $.filesDataBinding(data,$(window['htmlCache'][dataView]),that,callback);
                }
            } else {
                $.get(id,function(dom){
                    window['htmlCache'][dataView] = dom;
                    var $item = $(dom);
                    if(data){
                        $.filesDataBinding(data,$item,that,callback);
                    }
                });
            }
            return that;
        };
        $.filesDataBinding = function(data,$fileItem,container,callback){
            var i = 0, l = data.length;
            require('animationStep');
            for(;i<l;i++){
                var $item = $fileItem.clone(), curData = data[i], k = $('[data-query]',$item).length;
                while(k--){
                    var $binder = $('[data-query]',$item).eq(k),
                        bindMethod = $binder.data('query').split(':')[0],
                        dataName = $binder.data('query').split(':')[1];
                    if(['innerHTML','src','id', 'value'].indexOf(bindMethod) >= 0){
                        $binder[0][bindMethod] = curData[dataName];
                    } else {
                        $binder[0].setAttribute(bindMethod,curData[dataName]);
                    }
                }
                if(i===0){
                    container.html('');
                }
                if($item.attr('data-toggle') === 'animationStep'){
                    $item.attr('data-animation-delay',(0.15 * i)).appendTo(container).animationStep();
                } else {
                    $item.appendTo(container);
                }
                if(callback){
                    switch ($.type(callback)){
                        case 'function':
                            callback($item,i,l);
                            break;
                        case 'string':
                            require('module/designer/foreach_action')[callback]($item,i,l);
                            break;
                    }
                }
            }
        };
    })($);
});