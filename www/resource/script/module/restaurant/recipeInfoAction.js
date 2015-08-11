define(function(require, exports, module){
    return function() {
        var G = window[window.module],
            floatCalculate = require('global/floatCalculate'),
            $ = require('$'),
            api = require('api'),
             storage = window.localStorage,
             menuOperating = parseInt($('#menuOperating').val()),
            orderId = parseInt($('#sel-order').val()),
            tableId = parseInt($('#sel-table').val()),
            selectMenuData = storage.getItem('selectMenuData') ? JSON.parse(storage.getItem('selectMenuData')) : {}, //点餐菜单存储对象
            addMenuData = storage.getItem('addMenuData') ? JSON.parse(storage.getItem('addMenuData')) : {}, //加菜菜单存储对象
            menuData = storage.getItem('menuData') ? JSON.parse(storage.getItem('menuData')) : {}, //菜单存储对象
            totalCount = 0,
            totalPrice=0,
            toString = Object.prototype.toString,
            kData = function(data){
                if(toString.call(data) === '[object String]'){
                    data = JSON.parse(data);
                }
                return data;
            },
            dataWaiter = require('global/dataWaiter'),
            btnAddMenu = $('.add-menu');
        require('global/swiper.js')();
        require('plugin/jquery.picturePreview.js');
        require('animationStep');

        //堂食操作类型 1、保存菜单2、选餐 3、加菜
        var strMenuData = 'menuData';
        switch (menuOperating) {
            case 2:
                menuData = selectMenuData;
                strMenuData = 'selectMenuData';
                break;
            case 3:
                menuData = addMenuData;
                strMenuData = 'addMenuData';
                break;
        }

        G['goIndex'] = function () {
            //堂食操作类型 1、保存菜单2、点餐 3、加菜
            var goToUrl;
            switch (menuOperating) {
                case 1:
                    goToUrl = mobileDomain + "/tangshi/0";
                    break;
                case 2: //点餐
                    goToUrl = mobileDomain + "/tangshi/0?tableId=" + tableId;
                    break;
                case 3:
                    goToUrl = mobileDomain + "/tangshi/0?orderId=" + orderId;
                    break;
                default:
                    goToUrl = mobileDomain + "/tangshi/0";
            }
            window.location.href = goToUrl;
        };

        //评论加载更多
        G['loadMore']=function() {
            var $next = $('.item-next');
            if ($next[0]) {
                $('.mainContaine-mask').show();
                $.post($next.val(), {}, function (data) {
                    $(data).appendTo($('.comment'));
                    $next.remove();
                    $next = $('.item-next');
                    if ($next.val() !== "") {
                        $('.load-more').appendTo($('.comment'));
                    } else {
                        $('.load-more').remove();
                    }
                });
            }
        }


        //添加菜品
        G['addDishItem'] = function(event, dishId, price){
            // console.log(event.target);
            event = event || window.event;
            if (menuData[dishId]) {
                menuData[dishId]++;
            } else {
                menuData[dishId] = 1;
            }
            try {
                totalPrice += parseInt(price, 10);
                $('.menu .price').html("￥" + floatCalculate.intTofloat(totalPrice));
                totalCount += 1;
                $('.menu .num').html(totalCount);
                storage.setItem(strMenuData, JSON.stringify(menuData));
                //简单动画
                $('.menu').find('em').addClass('sc2');
                setTimeout(function () {
                    $('.menu').find('em').removeClass('sc2');
                }, 600);

                //按钮置为可用
                $('.that-btn').removeClass('disabled');
            } catch (e) {

            }
            event.stopPropagation();
            return false;
        };

        //初始化菜单车
        G['initMenuItem'] = function () {
            var cartString = escape(JSON.stringify(menuData));
            if (cartString && cartString !== '{}') {
                $.ajax({
                    url: mobileDomain+"/CanYin/TangShi/TangShiMenu/MenuSummaryItem",
                    data: { "cartString": cartString },
                    success: function (data) {
                        if (data) {
                            //$(".my-dishes").html(data);
                            $(".my-dishes").find('a').before(data);
                        }
                        //赋值总价格、总数量
                        totalPrice = parseInt($('.menu .price').data('totalprice'));
                        totalCount = parseInt($('.menu .num').data('totalnum'));
                        //菜单车为空 下一步按钮置灰
                        if (!totalCount) $('.that-btn').addClass('disabled');
                    }
                });
            }
        }

        //下一步去心愿单
        G['goMyMenu'] = function () {

            var goToUrl;
            switch (menuOperating) {
                case 1:
                    goToUrl = mobileDomain + "/tangshi/menu/save/confirm";
                    break;
                case 2: //点餐
                    goToUrl = mobileDomain + "/menu/add/" + menuOperating + "?tableId=" + tableId;
                    break;
                case 3:
                    goToUrl = mobileDomain + "/menu/add/" + menuOperating + "?orderId=" + orderId;
                    break;
                default:
                    goToUrl = mobileDomain + "/tangshi/menu/save/confirm";
            }
            window.location.href = goToUrl;
        };

        //页面载入函数
        $(function() {
            //初始化菜单车
            G['initMenuItem']();

            $('.mainContaine-mask').hide();
            $('.c-img').each(function () {
                $('img', this).picturePreview();
            });
            $('.food-img li[data-src]').not('.swiper-slide-duplicate').picturePreview();

        });
      
    };
});