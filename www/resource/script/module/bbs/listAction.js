define(function(require, exports, module){
    return function(){
        var $ = require('jquery'), isLoading = false;
        $(window).scroll(function(){
            var $forumList = $('.forum-list'),
                scrollTop = $(document).scrollTop(),
                scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight,
                windowHeight = $(window).height(),
                len = $forumList.find('li').length,
                $lastLi = $forumList.find('li').eq(len-1);

            if(scrollTop + windowHeight > scrollHeight - 20){
                if(!isLoading){
                    isLoading = !isLoading;
                    if($lastLi.find('input[type="hidden"]')[0]){
                        var $i = $('<span><i class="fa fa-spin fa-spinner fx24"></i>&nbsp;努力加载中</span>').prependTo($lastLi);
                        var url = $lastLi.find('input').val();
                        $.get(url,function(data){
                            isLoading = false;
                            if($(data).find('li')[0]){
                                $('.item-next').remove();
                                $($(data).html()).appendTo($forumList).not('.no-data-2').attr('data-animation-name','bounceInRight').animationStep({delay:0.5});
                                //$('.no-data-2').addClass('active');
                            }
                        });
                    }else{
                        var $x = $('.no-data-2').removeClass('active').animationStep({name:'fadeInLeftBig',delay:0.2});
                        setTimeout(function(){
                            $x.play($x,'fadeOutLeftBig',function(){
                                $('.no-data-2').addClass('active');
                                isLoading = false;
                            });
                        },2500);
                    }
                }

            }
        });
    };
});