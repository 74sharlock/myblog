define(function(require,exports,module){
    return function(){
        var mainContent = document.querySelector('.mainContainer-content'),
            isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click',
            $ = require('$'),
            prefix = location.protocol + '//' + location.hostname + (location.port === '80' ? '': ':' +location.port);

        //点击加载更多
        require('global/clickLoadMore')({
            callback:function(data){
                var next = $('.item-next'), noDataItem = $('.no-data-2');
                if(next[0]){
                    $(data).appendTo($('.mainContainer-content'));
                    next.eq(0).remove();
                    if (noDataItem) {
                        $('.load-more').appendTo($('.mainContainer-content'));
                    } else {
                        $('.load-more').eq(0).remove();
                    }
                    
                }
            }
        });

        $('.mainContainer-bottom-fixed[data-href]').click(function(){
            var href = $(this).data('href');
            window.location = location.protocol + '//' + location.hostname + (location.port == '80'?'':':' + location.port) +href;
        });

        var api = require('api');

        $(".praise-btn").each(function () {
            var id = $(this).data("id"), type = $(this).data("type");
            if(window.localStorage && window.localStorage.getItem){
                if (window.localStorage.getItem(type + '_' + id)) {
                    $("i", this).addClass("fa-thumbs-up");
                }
            }
        });
        $("body").on(isPhone?'touchend':'click', '.praise-btn', (function (e) {
            var id = $(this).data("id"), type = $(this).data("type"), $i = $("i", this), $em = $("em", this), praiseCount = parseInt($em.text(), 10);
            if (type === 'ReplyPrise') {
                return false;
            }
            if ($i.hasClass("fa-thumbs-up")) {
                return false;
            }
            $i.addClass("fa-thumbs-up");
            try{
                window.localStorage.removeItem(type + '_' + id);
            } catch (e){
            }

            try{
                window.localStorage.setItem(type + "_" + id, 1);
            } catch (e){

            }
            if(praiseCount > 98) {
                $em[0].innerHTML = '99+';
            }else{
                $em[0].innerHTML = praiseCount + 1;
            }
            $.post(api.communityreplyPraise, {
                "id": id,
                "type": type
            }, function (data) {
                data = JSON.parse(data);
                if (!data.ResponseID) {
                } else {
                    alert(data['Message']);
                }
            });

        }));


        //分享
        mainContent.addEventListener(click,function(e){
            if($(e.target).hasClass('fa-share-alt') || $(e.target).children('i.fa-share-alt')[0]){
                var ua = navigator.userAgent.toLowerCase(),
                    content = $(e.target).parents('.topics-block')[0].querySelector('.topics-content');
                if(ua.indexOf('micromessenger')>0){
                    require('global/wxShare').show();
                } else {
                    var share = require('global/share.js');
                    share.shareConfig = {
                        summary:content.innerText
                    };
                    share.show();
                }
            }
        },false);
    };
});