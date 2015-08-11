define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            floatCalculate = require('global/floatCalculate'),
            $ = require('$'),
            api = require('api'),
            storage = window.localStorage,
            menuData = storage.getItem('menuData') ? JSON.parse(storage.getItem('menuData')) : {}, //菜单存储对象
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
                $('.menu-price').find('i').html(floatCalculate.intTofloat(totalPrice));
                totalCount += 1;
                count++;
                $('.menu .num').html(totalCount);
                $('.menu-num').find('i').html(totalCount + '份');
                $span.html(count);
                storage.setItem('menuData', JSON.stringify(menuData));
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
                    $('.menu-price').find('i').html(floatCalculate.intTofloat(totalPrice));
                    totalCount -= 1;
                    count--;
                    $('.menu .num').html(totalCount);
                    $('.menu-num').find('i').html(totalCount + '份');
                    $span.html(count);

                    if (totalCount <= 0) {
                        $('.that-btn').addClass('disabled');
                    }

                    storage.setItem('menuData', JSON.stringify(menuData));
                } catch (e) {

                }
            } else {//todo：提示并删除该条菜品
                D({
                    title: '提示',
                    content: '<div class="text-center">亲你要删除该菜品么？</div>',
                    ok: function () {
                        //确认删除
                        delete menuData[dishId];
                        storage.setItem('menuData', JSON.stringify(menuData));
                        $(self).parent().parent().remove();
                        D.close();

                        try {

                            totalPrice -= parseInt(price, 10);
                            $('.menu .price').html("￥" + floatCalculate.intTofloat(totalPrice));
                            $('.menu-price').find('i').html(floatCalculate.intTofloat(totalPrice));
                            totalCount -= 1;
                            count--;
                            $('.menu .num').html(totalCount);
                            $('.menu-num').find('i').html(totalCount + '份');
                            $span.html(count);

                            if (totalCount <= 0) {
                                $('.that-btn').addClass('disabled');
                            }

                            storage.setItem('menuData', JSON.stringify(menuData));
                        } catch (e) {

                        }
                        return true;
                    },
                    okValue: '不留它',
                    cancelValue: '留着它'
                }).show();

            }

            return false;
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
                url: mobileDomain+'/CanYin/TangShi/TangShiMenu/SendSmsVerifyCode',
                data: { 'tel': tel, 'codeType': 6 },
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
        //检查验证码
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
            var name = $('#name').val().trim();//todo : 名字长度限制
            if (!name) {
                D.alert("<div class='text-center'>起个名字吧</div>");
                return false;
            }

            $.ajax({
                url: mobileDomain+'/CanYin/TangShi/TangShiMenu/CheckSmsVerifyCode',
                data: { 'tel': tel, 'code': code },
                success: function (data) {
                    if (data) {
                        if (!data.State) {
                            D.alert("<div class='text-center'>验证码错误，请检查验证码!</div>");
                            return false;
                        }
                        //保存菜单
                        dataWaiter.show();
                        $.ajax({
                            url: mobileDomain+'/CanYin/TangShi/TangShiMenu/SaveRecipeMenu',
                            data: { 'Tel': tel, "Name": name, "cartstring": cartString },
                            success: function (data) {
                                if (data) {
                                    dataWaiter.close();
                                    if (data.menuId > 0) {
                                        //清空心愿单本地存储
                                        window.localStorage.removeItem('menuData');
                                        D({
                                            title: '提示',
                                            content: '<div class="text-center">保存菜单成功</div>',
                                            ok: function () {
                                                //保存菜单成功  跳转//tangshi/menu/detail/{menuId}
                                                window.location.href = mobileDomain+"/tangshi";
                                            },
                                            okValue: '返回首页',
                                            cancel: function () {
                                                window.location.href = mobileDomain+"/tangshi/menu/detail/" + data.menuId;
                                            },
                                            cancelValue: '去看看'
                                        }).show();

                                    } else {
                                        D.alert("<div class='text-center'>保存菜单失败，重新来一次!</div>");
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

        //保存菜单
        G['saveMyMenu'] = function () {


            var cartString = escape(JSON.stringify(menuData));
            if (!cartString || cartString === '{}') {
                D.alert("<div class='text-center'>菜单数据异常，亲检查下！^_^</div>");
                return;
            }
            var name = $('#name').val().trim();//todo : 名字长度限制
            if (!name) {
                D.alert("<div class='text-center'>起个名字吧</div>");
                return;
            }
            //检查验证码
            //var state = G['checkSmsCode'](tel, code);
            //if (!state) return;
            if ($('.tel-code').length > 0) { //有短信验证信息  检测短信验证码
                G['checkSmsCode']();
            } else {//无需检测短信验证码 下一步保存菜单
                dataWaiter.show();
                $.ajax({
                    url:mobileDomain+ '/CanYin/TangShi/TangShiMenu/SaveRecipeMenu',
                    data: { "name": name, "cartstring": cartString },
                    success: function (data) {
                        if (data) {
                            dataWaiter.close();
                            //D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                            if (data.menuId > 0) {
                                //清空心愿单本地存储
                                window.localStorage.removeItem('menuData');
                                D({
                                    title: '提示',
                                    content: '<div class="text-center">保存菜单成功</div>',
                                    ok: function () {
                                        //保存菜单成功  跳转//tangshi/menu/detail/{menuId}
                                        window.location.href = mobileDomain+"/tangshi";
                                    },
                                    okValue: '返回首页',
                                    cancel: function () {
                                        window.location.href = mobileDomain+"/tangshi/menu/detail/" + data.menuId;
                                    },
                                    cancelValue: '去看看'
                                }).show();

                            } else {
                                D.alert("<div class='text-center'>保存菜单失败，重新来一次!</div>");
                            }
                        }
                    }
                });
            }

        };

        //初始化菜单信息
        G['initMenuInfo'] = function () {
            var cartString = escape(JSON.stringify(menuData));
            if (cartString && cartString !== '{}') {
                dataWaiter.show();
                $.ajax({
                    url: mobileDomain+"/CanYin/TangShi/TangShiMenu/MenuInfo",
                    data: { "cartString": cartString },
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
                                window.location.href = mobileDomain+'/tangshi';
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