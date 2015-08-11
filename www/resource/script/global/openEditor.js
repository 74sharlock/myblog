define(function(require,exprots,module){
    return function(opitions){
        var editor = require('api')['editor'],
            d = require('plugin/dialog')({
                title:opitions.title || '文本编辑器',
                width:opitions.width || 680,
                height:opitions.height || 401,
                content:'<iframe name="编辑内容" frameborder="0" style="width: 100%; height: 100%; border: none;" src="' + (opitions.url || editor) + '"></iframe>',
                ok:function(){
                    var self = this,
                        win = self.node.querySelector('iframe').contentWindow;
                    if(Object.prototype.toString.call(opitions.ok) === '[object Function]'){
                        opitions.ok(self, win);
                    } else {
                        self.remove();
                    }
                    return false;
                },
                okValue:opitions.okValue || '确认',
                cancel:function(){
                    var self = this,
                        win = self.node.querySelector('iframe').contentWindow;
                    if(Object.prototype.toString.call(opitions.cancel) === '[object Function]'){
                        opitions.cancel(self,win);
                    }
                    self.remove();
                },
                onshow:function(){
                    var self = this,
                        win = self.node.querySelector('iframe').contentWindow;
                    if(Object.prototype.toString.call(opitions.onshow) === '[object Function]'){
                        opitions.onshow(self,win);
                    }
                },
                cancelValue:opitions.cancelValue || '取消'
            });

        if(opitions.showModal === false){
            d.show();
        } else {
            d.showModal();
        }
    };
});