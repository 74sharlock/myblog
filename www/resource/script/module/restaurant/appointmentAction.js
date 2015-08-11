define(function(require, exports, module){
    return function() {
        var G, $, $selectors, $timer, $seats, $dateList, $seatLIst, trsEnd,
            $ = require('$'), D = require('plugin/m_dialog.js'), dataWaiter = require('global/dataWaiter');
       


        trsEnd = require('event').transitionEnd;
        G = window[window.module];
        $selectors = $('#selectors');
        $timer = $('div.timer', $selectors);
        $seats = $('div.seats', $selectors);
        $dateList = $('div.date ul', $timer);
        $seatLIst = $('ul.seat', $selectors);

        G.closeSelector  = function(){
            $selectors.addClass('hidden');
        };

        G.showSelector = function(){
            if($selectors.hasClass('hidden')){
                $selectors.removeClass('hidden');
            }
        };

        G.getMeal = function(event,id){
            var target = event.target;
            $(target).addClass('active').siblings().removeClass('active');
            var $dateli = $('li[class="active"]', $dateList);
            $("#timeSelector").html($dateli.data('date') + " " + $dateli.data('week') + " " + $(target).html());
            $("#DinnerDate").val($dateli.data('date'));
            $("#DinnerDateDetail").val($(target).html());
            G.closeSelector();
        };

        G.getDate = function(index){
            $('li', $dateList).eq(index).addClass('active').siblings('li').removeClass('active');
        };

        G.getSeat = function (id, name) {
            $("#TableClassId").val(id);
            $("#TableClassName").val(name);
            $('#seatSelector').html(name);
            G.closeSelector();
        };
        G.getVerifyCode = function (o) {
            var tel = $('#ContactNumber').val();
            var reg = /^1\d{10}$/;
            if (!reg.test(tel)) {
                D.alert('<div style="text-align:center">请输入正确的手机号码。</div>');
                return false;
            }
            D.tips('<div style="text-align:center">发送验证码成功！');
            var iNow = 59,
                timer;
            $(o).addClass('disabled');
            timer = setInterval(function() {
                if (iNow === 0) {
                    clearInterval(timer);
                    $(o).removeClass('disabled').html('获取');
                } else {
                    $(o).html(iNow + '秒后获取');
                    iNow--;
                }
            }, 1000);
            $.post(mobileDomain+'/CanYin/TangShi/TangShiMenu/SendSmsVerifyCode', { tel: tel, codeType: 'WaiMaiBooking' });
            return false;
        };
        G.YuDing = function () {
           if ($("#DinnerDate").val() == "") {
               D.alert('<div style="text-align:center">预订日期是必选的哦。</div>');
                return false;
            }
            if ($("#TableClassId").val() == "") {
                D.alert('<div style="text-align:center">选择一下要预订座位信息吧！</div>');
                return false;
            }
            var reserveNumber = parseInt($("#ReserveNumber").val());
            
            var reg = /^[1-9]*[1-9][0-9]*$/;
            
            if (!reg.test(reserveNumber)) {
                D.alert('<div style="text-align:center">请填写正确的用餐人数吧。</div>');
                return false;
            }
           
            var tel = $('#ContactNumber').val();
             reg = /^1\d{10}$/;
            if (!reg.test(tel)) {
                D.alert('<div style="text-align:center">请输入正确的手机号码。</div>');
                return false;
            }

            if ($("#VerifyCode").val() == "") {
                D.alert('<div style="text-align:center">验证码不能为空。</div>');
                return false;
            }
            
            if ($("#Contact").val() == "") {
                D.alert('<div style="text-align:center">称呼是必填的，要不怎么称呼您呢？</div>');
                return false;
            }
            dataWaiter.show();
            var strData = $("body input").map(function() {
                return ($(this).attr("name") + '=' + $(this).val());
            }).get().join("&");
            $.post(mobileDomain + '/yuding/reservation', strData, function(data) {
                if (!data.State) {
                    dataWaiter.close();
                    D.alert(data.Message);
                    return false;
                } else {
                    dataWaiter.close();
                    D.tips('<div style="text-align:center">预订成功！</div>', 2000, function() {
                        location.href = mobileDomain + '/yuding/detail/' + data.id;
                    });
                    return true;
                }
            });
            return false;
        };

        G.LoadMore = function () {
            var $next = $('.item-next');
            if ($next[0]) {
                dataWaiter.show();
                $.post($next.val(), {}, function(data) {
                    $(data).appendTo($('.order-list'));
                    $next.remove();
                    $next = $('.item-next');
                    dataWaiter.close();
                    console.log($next.val());
                    if ($next.val() != "") {
                        $('.load-more').appendTo($('.comment'));
                    } else {
                        $('.load-more').remove();
                    }
                });
            }
        };

        G.gotoDetails = function (id) {
            location.href =mobileDomain+ '/yuding/detail/' +id;
        };

        $('.selector').on('click',function(){
            G.showSelector();
            var id = this.id;
            switch (id){
                case 'timeSelector':
                    if($timer.hasClass('hidden')){
                        $timer.removeClass('hidden').siblings('.select-content').removeClass('active').addClass('hidden');
                        setTimeout(function(){
                            $timer.addClass('active');
                        });
                    }
                    break;
                case 'seatSelector':
                    if($seats.hasClass('hidden')){
                        $seats.removeClass('hidden').siblings('.select-content').removeClass('active').addClass('hidden');
                        setTimeout(function(){
                            $seats.addClass('active');
                        });
                    }
                    break;
            }
        });
    };
});