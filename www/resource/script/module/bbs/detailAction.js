define(function(require, exports, module){
    return function(){
        var $ = require('jquery'),
            global = require('global'),
            $infoReviewComments = $("#commentsInput"),
            $postReplyBtn = $(".btn-post-reply");

        var isPostReviewIng = false;
        $postReplyBtn.on('click', function (e) {

            var contemt = $.trim($infoReviewComments.val());
            if (!contemt || isPostReviewIng) {
                $infoReviewComments.val("");
                return;
            }
            var postData = {
                informationId: $infoReviewComments.data("infoid"),
                reviewType: $infoReviewComments.data("type"),
                informationCategoryId: $infoReviewComments.data("type")
            };
            postData.Content =global.htmlEncode(global.htmlEncode(contemt));
            isPostReviewIng = true;
            require('global').infoReviewPost(postData, function (data) {
                var addId = data.Data.Id;
                if (addId > 0) {
                    // 获取新的评论信息
                    $.ajax({
                        url: "/wap/bbs/ReviewDetail?reviewId=" + addId,
                        success: function (datahtm) {
                            var $forumFloorList = $('.forum-floor-list');
                            var $datahtm = $(datahtm).css({'opacity':0}).appendTo($forumFloorList);
                            var $li = $forumFloorList.children('li'), l = $forumFloorList.children('li').length;
                            require('animationStep');
                            $('body,html').animate({scrollTop:$li.eq(l-1).offset().top + $li.eq(l-1).outerHeight(true)},function(){
                                $datahtm.removeAttr('style').animationStep({delay:0,duration:0.5});
                            });
                        }
                    });
                }
                $infoReviewComments.val("");
                isPostReviewIng = false; // 评论结束
            });
        });
    };
});