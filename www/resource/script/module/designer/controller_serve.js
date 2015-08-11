define(function(require, exports, module){
    module.exports = {
        navServe:function(){
            var $fileQueryBtn = $('#fileQueryBtn'),
                $menu = $fileQueryBtn.next('ul');
            $fileQueryBtn.parent().on('show.bs.dropdown',function(){
                require('dataQuery');
                var data = require('module/designer/test-data').files;
                $menu.getView(data,function($item,index){
                    require('module/designer/foreach_action').delFileItem($item,index);
                });
            });
        },
        mapServe:function($item){
            window.isPanelLoading = false;
        },
        panelServe:function($item){
            require('sea_css');
            var $today = $('.today',$item);
            require('plugin/timeNow');
            $today.timeNow();
//            require('discreteness');
//            var a1 = document.createElement('a'), a2 = document.createElement('a');
//            a1.className = 'cselectorImageSelect';
//            a1.setAttribute('data-ctype','user');
//            a1.setAttribute('callback','jj');
//            a1.innerHTML = '<img src="/img/no-img.gif">';
//            a2.className = 'btn btn-success cselectorLinkbtn';
//            a2.innerHTML = '<i class="fa fa-link"></i><span> 选择链接</span>';
//            document.body.appendChild(a1);
//            document.body.appendChild(a2);
//            window.jj = function(){
//                console.log('done!Everything works well!',arguments);
//            };
        },
        attrPanelServe:function(){
        },
        controlsServe:function(){},
        botServe:function(){}
    }
});