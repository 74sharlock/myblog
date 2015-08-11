define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            floatCalculate = require('global/floatCalculate'),
            $ = require('$'),
            $tpl = require('$tpl'),
            api = require('api'),
             storage = window.localStorage,
            menuOperating = parseInt($('#menuOperating').val()),
            orderId = parseInt($('#sel-order').val()),
            tableId = parseInt($('#sel-table').val()),
            menuData = storage.getItem('menuData') ? JSON.parse(storage.getItem('menuData')) : {}, //保存菜单存储对象
            selectMenuData = storage.getItem('selectMenuData') ? JSON.parse(storage.getItem('selectMenuData')) : {}, //点餐菜单存储对象
            addMenuData = storage.getItem('addMenuData') ? JSON.parse(storage.getItem('addMenuData')) : {}, //加菜菜单存储对象
            totalCount = 0,
            totalPrice = 0,
            dataWaiter = require('global/dataWaiter'),
            $dishList = $('#foodList');

        require('animationStep');

        G['goToDish'] = function (id) {
            //堂食操作类型 1、保存菜单2、点餐 3、加菜
            var goToUrl;
            switch (menuOperating) {
                case 1:
                    goToUrl = mobileDomain + "/tangshi/food/detail/" + id;
                    break;
                case 2: //点餐
                    goToUrl = mobileDomain + "/tangshi/food/detail/" + id + "?menuOperating=" + menuOperating + "&tableId=" + tableId;
                    break;
                case 3:
                    goToUrl = mobileDomain + "/tangshi/food/detail/" + id + "?menuOperating=" + menuOperating + "&orderId=" + orderId;
                    break;
                default:
                    goToUrl = mobileDomain + "/tangshi/food/detail/" + id;
            }
            window.location.href = goToUrl;
        };

        //根据菜品分类获取菜品列表(有缓存)
        G['getDishes'] = function (catId) {
            var $item = $('[data-cat-id=' + catId + ']');
            //只为未选中的列表项执行逻辑
            if (!$item.hasClass('active')) {
                //如果不存在用于缓存的对象,创建缓存对象
                if (!G['dishList']) {
                    G['dishList'] = {};
                }
                //无缓存,服务器拉取
                if (!G['dishList'][catId]) {
                    dataWaiter.show();
                    $.post(api['getDishesUrl'], { classifyid: catId }, function (data) {
                        if (data) {//有数据
                            //这里缓存对象
                            G['dishList'][catId] = data;

                            $dishList.html(data);
                            $('.f-list').find('.tips').hide();
                            dataWaiter.close();
                        } else {//无数据
                            dataWaiter.close();
                            $('#foodList').empty();
                            $('.f-list').find('.tips').show();
                        }

                    });
                } else {//有缓存,读缓存
                    $dishList.html(G['dishList'][catId]);
                    //隐藏无数据div
                    $('.f-list').find('.tips').hide();
                }
                //dom增加选中样式
                $item.addClass('cur').siblings('li').removeClass('cur');
                window.scrollTo(0, 0);
                //$dishList.scrollTop(0);
            }
        };

        //添加菜品
        G['addDishItem'] = function (event, dishId, price) {
            event = event || window.event;
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
            // console.log(event.target);
            if (menuData[dishId]) {
                menuData[dishId]++;
            } else {
                menuData[dishId] = 1;
            }
            totalPrice += parseInt(price, 10);
            totalCount += 1;

            var e = event || window.event;
            var eX = e.clientX,
                eY = e.clientY,
                aw = $("#ani_wrapper");
            aw.stop();
            //执行动画
            aw.css({ 'left': eX - 20, "bottom": $('body').innerHeight()- eY - 30, "display": "block", "opacity": 1 }).animate({
                left: "1rem",
                bottom: "0.5rem",
                opacity: .1
            }, 600, function () {
                aw.hide();

                try {
                    $('.menu .price').html("￥" + floatCalculate.intTofloat(totalPrice));
                    $('.menu .num').html(totalCount);
                    $('.that-btn').removeClass('disabled');
                    //设置本地存储
                    storage.setItem(strMenuData, JSON.stringify(menuData));
                } catch (ex) { }
                return false;
            });

            //简单动画
            $('.menu').find('em').addClass('sc2');
            setTimeout(function () {
                $('.menu').find('em').removeClass('sc2');
            }, 600);
            event.stopPropagation();
            return false;
        };

        //初始化菜单车
        G['initMenuItem'] = function () {
            var cartString = '{}';
            //堂食操作类型 1、保存菜单2、点餐 3、加菜
            //todo: 点餐 和加菜和保存菜单的本地存储
            switch (menuOperating) {
                case 1:
                    cartString = escape(JSON.stringify(menuData));
                    break;
                case 2:
                    cartString = escape(JSON.stringify(selectMenuData));
                    break;
                case 3:
                    cartString = escape(JSON.stringify(addMenuData));
                    break;
                default:
                    cartString = escape(JSON.stringify(menuData));
            }

            if (cartString && cartString !== '{}') {
                $.ajax({
                    url: mobileDomain + "/CanYin/TangShi/TangShiMenu/MenuSummaryItem",
                    data: { "cartString": cartString },
                    success: function (data) {
                        if (data) {
                            $(".my-dishes").find('a').before(data);
                        }
                        //赋值总价格、总数量
                        totalPrice = parseInt($('.menu .price').data('totalprice'));
                        totalCount = parseInt($('.menu .num').data('totalnum'));
                        if (totalCount) {
                            $('.that-btn').removeClass('disabled');
                        }

                    }
                });
            }
        }

        //下一步去心愿单
        G['goMyMenu'] = function () {
            //堂食操作类型 1、保存菜单2、点餐 3、加菜
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

        //初始化菜单车
        G['initMenuItem']();
    };
});