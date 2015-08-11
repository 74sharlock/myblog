define(function(require,exports,module){
    return function () {
        var $ = require('jquery'),
            $postReplyBtn = $(".btn-post-reply"),
            alertMask = document.querySelector('.alertMask'),
            detailId = $postReplyBtn.data('id'),
            api = require('api'),
            looksBtn = document.getElementById('looksBtn'),
            htmlEncode = require('global/htmlEncode'),
            looksBlock = document.querySelector('.looks-block'),
            submitBtn = document.getElementById('submitBtn'),
            cancelBtn = document.getElementById('cancelBtn'),
            content = document.getElementById('content'),
            mainContainer = document.querySelector('.mainContainer-content'),
            topicsComments = document.querySelector('.topics-comments'),
            commentsList = document.querySelector('.topics-comments-list'),
            getUrlParam = require('global/getUrlParam'),
            shareBtn = document.querySelector('.fa-share-alt'),
            isPhone = require('global/isPhone')(),
            Alert = require('global/alert.js'),
            click = isPhone ? 'touchend' : 'click';
        window.curPid = null;
        window.curTid = null;


        require('animationStep');

        //点击加载更多
        require('global/clickLoadMore')({
            insertTarget:document.querySelector('.topics-comments-list')
        });

        //分享
        shareBtn.parentNode.addEventListener(click,function(){
            var ua = navigator.userAgent.toLowerCase(),
                content = document.querySelector('.topics-content');
            if(ua.indexOf('micromessenger')>0){
                require('global/wxShare').show();
            } else {
                var share = require('global/share.js');
                share.shareConfig = {
                    summary:content.innerText
                };
                share.show();
            }
        },false);

        //回复当前话题初始化各种ID
        $postReplyBtn.click(function(e) {
            if(e.target.nodeName !== 'A' && (e.target.nodeName === 'I' && e.target.parentNode.nodeName !== 'A')){
                window.curTid = $(this).data('tid');
                window.curPid = $(this).data('pid');
                showModal();
            }
        });

        //回复评论的评论初始化各种id
        document.addEventListener(click,function(e){
            var target = e.target;
            if (target.classList.contains('fa-comments-o') || target.classList.contains('btn-post-reply')) {
                window.curPid = $(target).data('pid');
                window.curTid = $(target).data('tid');
                if($.type(window.curPid) !== 'undefined' && $.type(window.curTid) !== 'undefined'){
                    showModal();
                } else {
                    window.curPid = null;
                    window.curTid = null;
                }
            } else if(target.nodeName.toLowerCase() === 'span'){
                if(target.querySelector('i.fa-comments-o')){
                    var i = target.querySelector('i.fa-comments-o');
                    window.curPid = i.getAttribute('data-pid');
                    window.curTid = i.getAttribute('data-tid');
                    if($.type(window.curPid) !== 'undefined' && $.type(window.curTid) !== 'undefined'){
                        showModal();
                    } else {
                        window.curPid = null;
                        window.curTid = null;
                    }
                }
            } else if(target.classList.contains('praise-btn') || $(target).parents('.praise-btn')[0]){
                if($(target).parents('.praise-btn')[0]){
                    target = $(target).parents('.praise-btn')[0];
                }
                if(target.querySelector('i').classList.contains('fa-thumbs-up')){
                    return ;
                }
                var type = target.getAttribute('data-type'),
                    id = target.getAttribute('data-id'),
                    i2 = target.querySelector('i'),
                    em = target.querySelector('em'),
                    praiseCount = parseInt(em.innerText, 10);
                i2.classList.add("fa-thumbs-up");
                try{
                    window.localStorage.removeItem(type + '_' + id);
                } catch (e){
                }

                try{
                    window.localStorage.setItem(type + "_" + id, 1);
                } catch (e){

                }
                if(praiseCount > 98) {
                    em.innerHTML = '99+';
                }else{
                    em.innerHTML = praiseCount + 1;
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

            }
        },false);

        $(".praise-btn").each(function () {
            var id = $(this).data("id"), type = $(this).data("type");
            if(window.localStorage && window.localStorage.getItem){
                if (window.localStorage.getItem(type +'_'+ id)) {
                    $("i", this).addClass("fa-thumbs-up");
                }
            } else {
                alert('你的浏览器不支持本地存储!');
            }
        });

        //表情切换显示
        looksBtn.addEventListener(click, function() {
            looksBlock.classList.toggle('active');
        }, false);

        //插入表情
        $(".looks-block .list-unstyled a").click(function() {
            var $this;
            require('global/insertAtCursor.js');
            $this = $(this);
            $("#content").insertAtCursor($this.data("icon"));
        });

        //提交回复
        submitBtn.addEventListener(click,function(){
            submitReply();
        },false);

        //关闭回复
        cancelBtn.addEventListener(click,function(){
            closeModal();
        },false);

        //如果是从回复按钮进来直接打开话题回复框
        if(getUrlParam('hash')['reply']){
            $postReplyBtn.click();
        }

        //提交回复方法
        function submitReply(){
            if (window.curPid !== null && window.curTid !== null) {
                if ($('.ui-popup-show').length) {
                    return;
                }
                if (!$.trim(content.value)){
                    Alert('说点什么吧',2000,true,true);
                    return ;
                }
                if ($.trim(content.value).length>500) {
                    Alert('内容不能超过500字呀', 2000, true, true);
                    return;
                }

                //打开数据等待遮罩
                openDataWaiter();
                $.post(api['communityreplyUrl'], {
                    "Topicid": window.curTid,
                    "Parentid": window.curPid,
                    "Content": htmlEncode(content.value)
                }, function(data) {
                    if($.type(data) === 'string'){
                        data = JSON.parse(data);
                    }
                    if (data['Id']) {
                        //获取dom数据
                        $.get("/wap/MicroCommunity/ReplyDetail?id=" + data['Id'],function(data){
                            var interaction;
                            if(parseInt(window.curPid) !== 0){
                               
                                var curLi = commentsList.querySelector('li[data-id="' + window.curPid + '"]');
                                interaction = curLi.querySelector('.comments-interaction');
                                if(curLi){
                                    var theySaid = curLi.querySelector('.they-said');
                                    //如果不存在评论的评论的容器,创建之
                                    if(!theySaid){
                                        theySaid = document.createElement('div');
                                        theySaid.className = 'they-said';
                                        curLi.appendChild(theySaid);
                                    }
                                    //插入评论
                                    theySaid.appendChild($(data)[0]);
                                }
                            } else {
                                interaction = document.querySelector('.topics-interaction');
                                //如果不存在评论的容器,创建之
                                if (!commentsList) {
                                    if (!topicsComments) {
                                        topicsComments=document.createElement('div');
                                        topicsComments.className = 'topics-comments';
                                        mainContainer.appendChild(topicsComments);
                                    } 
                                    commentsList = document.createElement('ul');
                                    commentsList.className = 'topics-comments-list list-unstyled';
                                    topicsComments.appendChild(commentsList);
                                    var nodataDiv = document.querySelector('.no-data-here');
                                    if (nodataDiv) {
                                        topicsComments.removeChild(nodataDiv);
                                    }
                                }
                                //插入评论(如果已经有评论,插入最前面,没有就直接插入)
                                if(commentsList.getElementsByTagName('li').length){
                                    commentsList.insertBefore($(data)[0],commentsList.getElementsByTagName('li')[0]);
                                } else {
                                    commentsList.appendChild($(data)[0]);
                                }
                            }
                            //评论数加1
                            var commentIcon = interaction.querySelector('i.fa-comments-o'),
                                span = commentIcon.parentNode;
                            span.innerHTML = commentIcon.outerHTML + ' ' +(parseInt(span.innerText,10) + 1);
                            //关闭话题发表框和数据等待遮罩
                            closeModal();
                            closeDataWaiter();
                        });
                    } else {
                        closeModal();
                        Alert(data['Message'],2000,true,true);
                    }
                });
            }
        }

        //打开数据提交时的遮罩
        function openDataWaiter(){
            var dataWaiter = document.querySelector('.data-waiter');
            if(!dataWaiter){
                dataWaiter = document.createElement('div');
                dataWaiter.className = "data-waiter hidden";
                dataWaiter.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
                document.body.appendChild(dataWaiter);
            }
            dataWaiter.classList.remove('hidden');
            dataWaiter.classList.add('waiting');
        }

        //关闭数据提交时的遮罩
        function closeDataWaiter(){
            var dataWaiter = document.querySelector('.data-waiter');
            if(dataWaiter.classList.contains('waiting')){
                dataWaiter.classList.remove('waiting');
                dataWaiter.classList.add('hidden');
            }
        }

        //打开回复弹出层方法
        function showModal(){
            alertMask.classList.remove('hidden');
            setTimeout(function(){
                alertMask.classList.add('active');
            });
        }
        //关闭回复弹出层方法
        function closeModal(){
            //清空当前话题ID和父Id
            window.curPid = null;
            window.curTid = null;
            //移除遮罩
            alertMask.classList.remove('active');
            //清空文本域的内容
            content.value = '';

            //收起表情菜单
            looksBlock.classList.remove('active');

            //回复层过渡事件结束,隐藏
            alertMask.addEventListener('transitionend',handler,false);
            alertMask.addEventListener('webkitTransitionEnd',handler,false);
        }

        function handler(e){
            if(e.target === this){
                if(!(this.classList.contains('hidden'))){
                    this.classList.add('hidden');
                }
                //释放过渡事件
                alertMask.removeEventListener('transitionend',handler,false);
                alertMask.removeEventListener('webkitTransitionEnd',handler,false);
            }
        }
    };
});