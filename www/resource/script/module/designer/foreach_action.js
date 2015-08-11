define(function(require, exports, module){
    var $ = require('jquery');
    module.exports = {
        delFileItem : function($item,index){
            var $trash = $('i.fa-trash',$item);
            $trash.click(function(e){
                e.stopPropagation();
                $item.remove();
            });
        },
        mapAction : function($item,index,length){
            var curPage = window.localStorage.getItem('curPageId') || 0, $panel = $('.phone-panel');
            $item.on('click',function(){
                var $this = $(this),
                    $view = $('.map-item-view',$this),
                    sceneUrl = $view.data('url'),
                    $loading = $('<div class="panel-block-loading"><i class="fa fa-spin fa-spinner"></i></div>').appendTo($panel);
                curPage = window.localStorage.setItem('curPageId',index);
                window.isPanelLoading = true;
                $this.addClass('active').siblings().removeClass('active');
                $panel.children('div').not('.panel-block-loading').addClass('filter-blur')
                    .end()
                    .end().load(sceneUrl,function(){
                    window.isPanelLoading = false;
                    require('animationStep');
                    var $aElem = $panel.find('[data-toggle="animationStep"]').animationStep();
                    $('.animation-replay-tooltips').unbind('click').click(function(){
                        var $this = $(this);
                        if(!$this.hasClass('disabled')){
                            $this.addClass('disabled');
                            $aElem.playAll(function(){
                                $this.removeClass('disabled');
                            });
                        }
                    });
                });
            });
            if(index === length - 1){
                $panel.parents('.designer-section').one(require('event').animationEnd,function(){
                    $item.parent().children().eq(curPage).trigger('click');
                });
            }
        }
    };
});