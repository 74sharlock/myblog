define(function(require,exports,module){
    return function(){
        var $ = require('$'),
            $addTopicsBtn = $('#addTopicsBtn'),
            openEditor = require('global/openEditor.js');
        $addTopicsBtn.click(function(){
            openEditor({
                url:require('api')['addTopicsPage'],
                top:true,
                title:'添加主题',
                ok:function(dialog,win){
                    win['submitData']({
                        url:require('api')['addTopics'],
                        fn: function (data) {
                            require('alert')(data['message'], 3000, true, true);
                            if (data.statusCode == "200") {
                                dialog.remove();
                                var href = $("#frame_content", parent.document).attr("src");
                                $("#frame_content", parent.document).attr("src", href);
                            }
                        }
                    });
                },
                cancel:function(){
                    console.log('cancel');
                },
                onshow:function(d){

                }
            })
        });
        //查看手机端详情页面
        $('[data-view]').on("click", function () {
            var id = $(this).attr("data-view") || 0;
            var options = {
                url: require('api')["wsqDetailUrl"](id)+"?ismanager=1",
                top: true,
                title: "查看详情",
                width:480
            };
            openEditor(options);
        });
        //置顶
        $('[data-top]').on("click", function () {
            var id = $(this).attr("data-top") || 0;
            $.post($(this).attr("href"), null, function (data) {
                require('alert')(data['message'], 3000, true, true);
                if (data.statusCode = "200") {
                    window.location.href = window.location.href;
                }
            });
            event.preventDefault();
        });
        //删除
        $('[data-delete]').on("click", function () {
            var id = $(this).attr("data-delete") || 0;
            var href = $(this).attr("href");
            var d = require('plugin/dialog');
            d({
                title: '确认提示',
                width: 300,
                content: '<div class="text-center">是否删除该主题？</div>',
                cancelValue:'取消',
                ok: function () {
                    var self = this;
                    self.remove();
                    $.post(href, { id: id }, function (data) {
                        require('alert')(data['message'], 3000, true, true);
                        if (data.statusCode = "200") {
                            window.location.href = window.location.href;
                        }
                    });
                    return false;
                },
                okValue: '确认',
                cancel: function () {
                    var self = this;
                    self.remove();
                }
            }).showModal();
            event.preventDefault();
        });
    };
});
