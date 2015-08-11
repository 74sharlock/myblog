define(function (require, exports, module) {

//    seajs.use(['sea_css'], function () {
//        seajs.use(['/resource/stylesheet/lib/mobilebone.animate.css', '/resource/stylesheet/lib/mobilebone.css']);
//    });

    var $ = require('jquery'),
        global = require('global'),
        event = require('event'),
        imgProportion = 9 / 11;
//    Mobilebone.init();

    global.swipe({
        rightEnd: function () {
            history.go(-1);
        },
        OffsetX: 20
    });

    //分类切换
    window.tabButtonActive = function (a, b, c) {
        var index = $(c.target).index();
        var target = document.querySelectorAll("#categoryNav a")[index];
        var eleAcive = document.querySelector("#categoryNav .active");
        if (eleAcive) eleAcive.classList.remove("active");
        if (target) target.classList.add("active");
    };

    //分类切换前检查(阻止当前分类按钮发送请求)
    window.checkClass = function (a) {
        return a.classList.contains('active');
    };

    //page载入后回调
    window.eventInit = function (a) {
        var $a = $(a),
            $header = $('.header-fixed', $a),
            $stop = $('[data-stop]', $a),
            $imgKeepProportion = $('.img-keep-proportion', $a),
            $inputTrigger = $('#inputTrigger', $a),
            $newsComments = $('#newsComments', $a),
            $commentCancelBtn = $('#commentCancelBtn', $a),
            $goTop = $('.go-top', $a),
            $praiseBtn = $('.praise-btn', $a),
            $mask = $('.mask'),
            $shareBtn = $('.share-btn', $a),
            $btnSearch = $('.btn-search', $a),
            $SearchKeyWords = $("#keywords", $a),
            $page = $('.page');

        if($mask.is(':visible')){
            $mask.hide();
        }

        if(!global.isPhone()){
            document.body.style.maxWidth = '480px';
            document.body.style.margin = '0 auto';
        }

        //touch冒泡阻止
        $stop.each(function (index, item) {
            item.addEventListener('touchstart', function (e) {
                e.stopPropagation();
            }, false);
        });

        //根据比例设置图片容器最大高度
        $imgKeepProportion.each(function (index, item) {
            global.imgKeepProportion(item, imgProportion);
        });

        //触发评论输入
        $inputTrigger.on('click', function () {
            $(this).parent().hide();
            if($a[0] !== document.body){
                $a.addClass('active');
            }
            else {
                $('.page').addClass('active');
            }
        });

        //关闭评论输入
        $commentCancelBtn.on('click', function () {
            $inputTrigger.parent().show();
            if($a[0] !== document.body){
                $a.removeClass('active');
            } else {
                $('.page').removeClass('active');
            }
        });

        $goTop.on(event.click(), function () {
            global.goTop();
        });

        //　评论模块
        var $infoReviewSubmitBtn = $('#commentSubmitBtn', $a);  // 评论提交按钮
        var $infoReviewComments = $('#commentsInput', $a);  // 评论输入按钮
        var isPostReviewIng = false;
        $infoReviewSubmitBtn.on(event.click(), function () {
            var contemt = $.trim($infoReviewComments.val());

            if (!contemt || isPostReviewIng) {
                return;
            }
           
            isPostReviewIng = true;
            // 组装 提交的 数据
            var postData = {
                informationId: $infoReviewComments.data("infoid"), // 新闻Id
                reviewType: $infoReviewComments.data("type"), // 新闻类别
                informationCategoryId: $infoReviewComments.data("type") // 新闻类Id
               // isNewInfoReview: true
            };
            postData.Content =global.htmlEncode(global.htmlEncode(contemt)); // 评论内容

            global.infoReviewPost(postData, function (data) {
                var addId = data.Data.Id;
                // 获取新的评论信息
                $.ajax({
                    url: "/wap/Review/ReviewDetail?reviewId=" + addId,
                    success: function (datahtm) {
                        $a.find(".comments-list").prepend(datahtm);
                        $a.find('.no-data').hide();
                        global.goTop();
                    }
                });

                $commentCancelBtn.trigger("click");
                $infoReviewComments.val("");
                isPostReviewIng = false; // 评论结束
            });
        });

        if (window.localStorage) {
            //点赞(caiJing)
            var praiseId = window.module + "_Praise_" + $praiseBtn.data("id");
            var isPraise = window.localStorage.getItem(praiseId);
            if (isPraise) {
                $praiseBtn.addClass("active");
            }
            $praiseBtn.on(event.click(), function() {
                var id = $(this).data("id");
                if (!isPraise) {
                    var $i = $('i', $praiseBtn), count = $i.text() ? parseInt($i.text(), 10) : 0;
                    count++;
                    if (count > 99) {
                        count = '99+';
                    }
                    $i.text(count);
                    $praiseBtn.addClass("active");
                    global.praise(id);
                    isPraise = true;
                    window.localStorage.setItem(praiseId, "1");
                }
            });
        }

        //app分享
        $shareBtn.on(event.click(), function () {
            require('app').appShare(document.title + '   ' + location.href);
        });

        $btnSearch.on(event.click(), function (e) {
            e.preventDefault();
            var val=$.trim($SearchKeyWords.val());
            if (val !== "") {
                window.location.href = "/news/list/1_10.html?SearchKey=" + $SearchKeyWords.val();
            }
        });

        //todo:下拉交互 && 滚动加载
        if ($page) {
            var isLoading = false, st = document.body.scrollHeight || document.documentElement.scrollHeight;
            $(window).on('scroll', function () {
                var scrollTop = $(document).scrollTop(),
                    scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight,
                    windowHeight = $(window).height(),
                    len = $page.find('li').length,
                    $lastLi = $page.find('li').eq(len-1),
                    $h = $('.news-comments-header'),
                    $headerFixed = $('.header-fixed'),
                    $detailHeader =$('.news-detail-header'),
                    h1 = $h.height() || 35;

                if(scrollTop >= st){
//                    $h.css({top:'-100%'});
//                    $detailHeader.css({transform:'translateY(-43px)'});
                    if(scrollTop >= h1 + 10){
                        $headerFixed.css({transform:'translateY(-42px)'});
                    }
                } else {
//                    $h.css({top:0});
//                    $detailHeader.css({transform:'translateY(0)'});
                    $headerFixed.css({transform:'translateY(0)'});
                }


//                if(scrollTop >= h1 + 10){
//                    $headerFixed.css({transform:'translateY(-42px)'});
//                } else if(scrollTop == 0) {
//                    $headerFixed.css({transform:'translateY(0)'});
//                }

                st = scrollTop;

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
                                    $page.find('ul').append($(data).html());
                                    //$('.no-data-2').addClass('active');
                                }
                            });
                        }else{
                            $('.no-data-2').removeClass('active').on(event.transitionEnd,function() {
                                $('.no-data-2').addClass('active');
                                isLoading = false;
                            });
                        }
                    }

                }
            });
//            seajs.use(['iScroll'],function(){
//                var iScroller = new IScroll('#newsList',{
//                    freeScroll: true,
//                    scrollbars: true
//                });
//                console.log(iScroller.options);
//            });
        }

        var keywordsInput = document.getElementById('keywords'), keywords = keywordsInput ? keywordsInput.value : null;
        if (keywords) {
            var titles = document.querySelectorAll('.title'), l = titles.length;
            while (l--) {
                var text = titles[l].innerHTML;
                titles[l].innerHTML = text.replace(keywords, '<s style="text-decoration:none;background-color:rgb(255, 242, 0);">' + keywords + '</s>')
            }
        }
    };

    $(function () {
        eventInit(document.body);
    });

});