define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            floatCalculate = require('global/floatCalculate'),
            $ = require('$'),
            api = require('api'),
            isneedBill = false,//是否需要发票
            menuOperating = parseInt($('#menuOperating').val() || 2),//获取本页面的操作类型  2点餐 3 加菜 
            orderId = parseInt($('#sel-order').val()),
            tableId = parseInt($('#sel-table').val()),
            storage = window.localStorage,
            menuData = storage.getItem('menuData') ? JSON.parse(storage.getItem('menuData')) : {}, //保存菜单存储对象
            selectMenuData = storage.getItem('selectMenuData') ? JSON.parse(storage.getItem('selectMenuData')) : {}, //点餐菜单存储对象
            addMenuData = storage.getItem('addMenuData') ? JSON.parse(storage.getItem('addMenuData')) : {}, //加菜菜单存储对象
            totalCount = 0,
            totalPrice = 0,
            toString = Object.prototype.toString,
            kData = function (data) {
                if (toString.call(data) === '[object String]') {
                    data = JSON.parse(data);
                }
                return data;
            },
            D = require('plugin/m_dialog.js'),
            dataWaiter = require('global/dataWaiter');
        require('animationStep');

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

        //添加菜品
        G['addDishItem'] = function (self, dishId, price) {
            var $span = $(self).parent().find('.deal-f-count'), count = parseInt($span.html());
            if (menuData[dishId]) {
                menuData[dishId]++;
            } else {
                menuData[dishId] = 1;
            }
            try {
                //简单动画
                $('.menu').find('em').addClass('sc2');
                setTimeout(function () {
                    $('.menu').find('em').removeClass('sc2');
                }, 600);

                totalPrice += parseInt(price, 10);
                $('.menu .price').html("￥" + floatCalculate.intTofloat(totalPrice));
                // $('.menu-price').find('i').html(floatCalculate.intTofloat(totalPrice));
                totalCount += 1;
                count++;
                $('.menu .num').html(totalCount);
                //  $('.menu-num').find('i').html(totalCount + '份');
                $span.html(count);
                storage.setItem(strMenuData, JSON.stringify(menuData));
            } catch (e) {

            }
            return false;
        };
        //减少菜品
        G['reduceDishItem'] = function (self, dishId, price) {
            var $span = $(self).parent().find('.deal-f-count'), count = parseInt($span.html());
            if (parseInt(menuData[dishId]) > 1) {
                menuData[dishId]--;
                try {

                    totalPrice -= parseInt(price, 10);
                    $('.menu .price').html("￥" + floatCalculate.intTofloat(totalPrice));
                    // $('.menu-price').find('i').html(floatCalculate.intTofloat(totalPrice));
                    totalCount -= 1;
                    count--;
                    $('.menu .num').html(totalCount);
                    //  $('.menu-num').find('i').html(totalCount + '份');
                    $span.html(count);

                    if (totalCount <= 0) {
                        $('.that-btn').addClass('disabled');
                    }

                    storage.setItem(strMenuData, JSON.stringify(menuData));
                } catch (e) {

                }
            } else {//todo：提示并删除该条菜品
                D({
                    title: '提示',
                    content: '<div class="text-center">亲你要删除该菜品么？</div>',
                    ok: function () {
                        //确认删除
                        delete menuData[dishId];
                        storage.setItem(strMenuData, JSON.stringify(menuData));
                        $(self).parent().parent().remove();
                        D.close();

                        try {

                            totalPrice -= parseInt(price, 10);
                            $('.menu .price').html("￥" + floatCalculate.intTofloat(totalPrice));
                            // $('.menu-price').find('i').html(floatCalculate.intTofloat(totalPrice));
                            totalCount -= 1;
                            count--;
                            $('.menu .num').html(totalCount);
                            // $('.menu-num').find('i').html(totalCount + '份');
                            $span.html(count);

                            if (totalCount <= 0) {
                                $('.that-btn').addClass('disabled');
                            }

                            storage.setItem(strMenuData, JSON.stringify(menuData));
                        } catch (ex) {

                        }
                        return true;
                    },
                    okValue: '不留它',
                    cancelValue: '留着它'
                }).show();

            }

            return false;
        };

        //添加菜品
        G['changeBill'] = function (self, billType) {
            if (billType === 'person') {
                $('#bill-info').hide(500);
            } else {
                $('#bill-info').show(500);
            }
        };

        //发送短信验证码
        G['sendSmsCode'] = function (event) {
            var self = event.target;
            var tel = $('#tel').val();
            var reg = /^1\d{10}$/;
            if (!reg.test(tel)) {
                D.alert("<div class='text-center'>请输入正确的电话号码</div>");
                return;
            }
            $.ajax({
                url: mobileDomain + '/CanYin/TangShi/TangShiMenu/SendSmsVerifyCode',
                data: { 'tel': tel, 'codeType': 7 },
                success: function (data) {
                    if (data) {
                        D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                        var iNow = 59, timer;
                        $(self).addClass('disabled');
                        timer = setInterval(function () {
                            if (iNow === 0) {
                                clearInterval(timer);
                                $(self).removeClass('disabled').html('获取');
                            } else {
                                $(self).html(iNow + '秒后获取');
                                iNow--;
                            }
                        }, 1000);

                    }
                }
            });
        };
        //1、检测验证码，2、提交订单
        G['checkSmsCode'] = function () {
            var cartString = escape(JSON.stringify(menuData));
            var tel = $('#tel').val();
            var reg = /^1\d{10}$/;
            if (!reg.test(tel)) {
                D.alert("<div class='text-center'>请输入正确的电话号码</div>");
                return false;
            }
            var code = $('#code').val().trim();
            if (!code) {
                D.alert("<div class='text-center'>验证码不能为空</div>");
                return false;
            }

            var remark = $('#order-remark').val().trim();
            var billText; //发票
            if ($('#bill-info').css('display') !== 'none') {//需要填写发票
                billText = $('#bill-info').find('input').val().trim();
                if (!billText) {
                    D.alert("<div class='text-center'>亲，麻烦填下发票信息呗！</div>");
                    return false;
                }
            }


            $.ajax({
                url: mobileDomain + '/CanYin/TangShi/TangShiMenu/CheckSmsVerifyCode',
                data: { 'tel': tel, 'code': code, 'codeType': 7 },
                success: function (data) {
                    if (data) {
                        if (!data.State) {
                            D.alert("<div class='text-center'>验证码错误，请检查验证码!</div>");
                            return false;
                        }
                        //提交订单
                        dataWaiter.show();
                        $.ajax({
                            url: mobileDomain + '/CanYin/TangShi/TangShiTable/SubmitTableRecipe',
                            data: { 'Tel': tel, "Invoice": billText, "Remark": remark, "cartstring": cartString, "tableId": tableId },
                            success: function (data) {
                                if (data) {
                                    dataWaiter.close();
                                    if (data.orderId > 0) {
                                        //清空心愿单本地存储
                                        window.localStorage.removeItem('selectMenuData');

                                        D.alert('<div class="text-center">^_^ 提交订单成功，请耐心等待</div>',
                                            function () {
                                                //todo wq 跳转到堂食订单详情
                                                window.location.href = mobileDomain + "/tangshi/order/detail/" + data.orderId;
                                            });

                                    } else {
                                        D.alert("<div class='text-center'>提交订单失败，重新来一次!</div>");
                                    }
                                }
                            }
                        });

                    }
                    return false;
                }
            });
            return true;
        };

        //提交订单
        G['saveMyMenu'] = function () {

            if ($('.tel-code').length > 0) { //有短信验证信息  检测短信验证码 提交订单
                G['checkSmsCode']();
            } else {
                var cartString = escape(JSON.stringify(menuData));
                if (!cartString || cartString === '{}') {
                    D.alert("<div class='text-center'>菜单数据异常，亲检查下！^_^</div>");
                    return;
                }
                var billInfo;
                if ($('#bill-info').css('display') !== 'none') {//需要填写发票
                    billInfo = $('#bill-info').find('input').val().trim();
                    if (!billInfo) {
                        D.alert("<div class='text-center'>亲，麻烦填下发票信息呗！</div>");
                        return;
                    }
                }
                //订单备注
                var remark = $('#order-remark').val().trim();
                dataWaiter.show();
                $.ajax({
                    url: mobileDomain + '/CanYin/TangShi/TangShiTable/SubmitTableRecipe',
                    data: { "Invoice": billInfo, "Remark": remark, "cartstring": cartString, "orderId": orderId, "tableId": tableId },
                    success: function (data) {
                        if (data) {
                            dataWaiter.close();
                            //D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                            if (data.orderId > 0) {
                                //清空心愿单本地存储
                                window.localStorage.removeItem('selectMenuData');
                                //todo: 向商家推送消息
                                $.get('/AdminUI/Public/Remind/Warn?orderId=' + data.orderId);

                                D.alert('<div class="text-center">^_^ 提交订单成功，请耐心等待</div>',
                                    function () {
                                        //提交订单成功   跳转//tangshi/menu/detail/{menuId}
                                        //todo wq 跳转到汤是订单详情
                                        window.location.href = mobileDomain + "/tangshi/order/detail/" + data.orderId;
                                    });

                            } else {
                                D.alert("<div class='text-center'>╮(╯▽╰)╭ 提交失败，在来一次!</div>");
                            }
                        }
                    }
                });

            }

           

        };

        //堂食加菜
        G['addOrderDish'] = function () {


            var cartString = escape(JSON.stringify(menuData));
            if (!cartString || cartString === '{}') {
                D.alert("<div class='text-center'>菜单数据异常，亲检查下！^_^</div>");
                return;
            }
            dataWaiter.show();
            $.ajax({
                url: mobileDomain + '/CanYin/TangShi/TangShiTable/AddOrderRecipe',
                data: {"cartstring": cartString, "orderId": orderId},
                success: function (data) {
                    if (data) {
                        dataWaiter.close();
                        //D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                        if (data.ResponseId > 0) {
                            //清空心愿单本地存储
                            window.localStorage.removeItem(strMenuData);

                            D.alert('<div class="text-center">^_^ 菜品已加入订单，请耐心等候！</div>',
                                function () {
                                    //提交订单成功   跳转//tangshi/menu/detail/{menuId}
                                    //todo wq 跳转到汤是订单详情
                                    window.location.href = mobileDomain + "/tangshi/order/detail/" + data.ResponseId;
                                });

                        } else {
                            D.alert("<div class='text-center'>╮(╯▽╰)╭ 菜品添加失败，请联系服务员!</div>");
                        }
                    }
                }
            });
        };

        //初始化菜单信息
        G['initMenuInfo'] = function () {
            //堂食操作类型  2、点餐 3、加菜
            var cartString;
            switch (menuOperating) {
                case 2:
                    cartString = escape(JSON.stringify(selectMenuData));
                    break;
                case 3:
                    cartString = escape(JSON.stringify(addMenuData));
                    break;
                default:
                    cartString = escape(JSON.stringify(selectMenuData));
            }
            if (cartString && cartString !== '{}') {
                dataWaiter.show();
                $.ajax({
                    url: mobileDomain + "/CanYin/TangShi/TangShiTable/ConfirmTableRecipe",
                    data: { "cartString": cartString, "MenuOperating": menuOperating },
                    success: function (data) {
                        if (data) {
                            $(".common-title").after(data);
                        }
                        //赋值总价格、总数量
                        totalPrice = parseInt($('.menu .price').data('totalprice'));
                        totalCount = parseInt($('.menu .num').data('totalnum'));
                        if (totalCount) {
                            $('.that-btn').removeClass('disabled');
                        } else {//本地存储不存在menuData
                            D.tips('亲，先去选择菜品吧！', 1500, function () {
                                window.location.href = mobileDomain + '/tangshi/0/' + menuOperating;
                            });
                        }
                        dataWaiter.close();
                    }
                });
            }
        }


        //初始化菜单信息
        G['initMenuInfo']();



    };
});