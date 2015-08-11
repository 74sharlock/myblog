//错误提示1
define(function(require, exports, module){
    return function(msg,time,noMask,justNotice){
        var d = require('plugin/dialog');

        seajs.use('sea_css',function(){
            seajs.use(['/resource/stylesheet/plugin/ui-dialog.css']);
        });

        if(justNotice){
            d = d({
                skin:"tips",
                title:false,
                content:'<div class="text-center">' + (msg || '操作失败.请稍后再试') + '</div>'
            });
        } else {
            d = d({
                width:'400',
                title:'提示',
                content:'<div class="text-center">' + (msg || '操作失败.请稍后再试') + '</div>',
                ok:function(){},
                okValue:'知道了'
            });
        }


        if(!noMask){
            d.showModal();
        } else {
            d.show();
        }

        if(Object.prototype.toString.call(time) === '[object Number]'){
            setTimeout(function(){
                d.remove();
            },time || 2000);
        }

    };
});