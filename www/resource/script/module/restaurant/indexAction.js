define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            floatCalculate = require('global/floatCalculate'),
            foodList = document.getElementById('foodList'),
            shopcartBtn = document.getElementsByClassName('btn-shopcart'),
            storage = window.localStorage,
            dataWaiter = require('global/dataWaiter'),
            $ = require('$'),
            shareBtn = document.querySelector('.fa-share-alt'),
            isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click',
            foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {},
            cartString = JSON.stringify(foodData);


        ////简单动画
        //function getAbsolutePosition(ele) {
        //    var absPos = {
        //        _cS: function (ele) {
        //            return getComputedStyle(ele);
        //        },
        //        absT: function (ele) {
        //            return ele.offsetTop + parseInt(this._cS(ele).paddingTop) || 0
        //        },
        //        absL: function (ele) {
        //            return ele.offsetLeft + parseInt(this._cS(ele).paddingLeft) || 0
        //        }
        //    }

        //    var t = absPos.absT(ele),
        //        l = absPos.absL(ele);
        //    while (ele.parentNode.nodeType == 1) {
        //        ele = ele.parentNode;
        //        t += absPos.absT(ele);
        //        l += absPos.absL(ele);
        //    }
        //    return {
        //        t: t,
        //        l: l
        //    }
        //}

        //var Fn = {
        //    gId: function (id) {
        //        return document.getElementById(id.replace("#", ''))
        //    },
        //    gClass: function (cName) {
        //        return document.querySelectorAll(cName.replace(".", ""))
        //    }
        //}
        //var aw = Fn.gId("ani_wrapper");

        var recipeCount = 0; //购物车菜品数量
        var sendPrice = parseFloat(0); //餐厅起送价
        var recipeTotalPrice = parseFloat(0); //菜品总价格
        var price = 0;
        //购物车逻辑
        $('#foodList').on('click', 'span.plus a', function (e) {
            var $this = $(this),
                $li = $this.closest('li'),
                id = parseInt($li.data('id'));
            price = parseFloat($li.data('price'));
            if (foodData[id]) {
                foodData[id]++;
            } else {
                foodData[id] = 1;
            }
            //执行动画之前进行数据的计算
            recipeCount += 1; //<sup>{0}</sup>
            recipeTotalPrice = floatCalculate.floatAdd(recipeTotalPrice, price);
            var diffPrice = floatCalculate.floatSub(sendPrice, recipeTotalPrice);

            e = e || window.event;
            var pX = e.clientX,
                pY = e.clientY,
                aw = $("#ani_wrapper");
            aw.stop();
            aw.css({ 'left': pX - 20, "bottom": document.body.clientHeight - pY - 30, "display": "block", "opacity": 1 }).animate({
                left: "1rem", bottom: "0.5rem", opacity: .1
            }, 600, function () {
                aw.hide();
                /* stuff to do after animation is complete */
                //   recipeCount += 1; //<sup>{0}</sup>
                if (!$('.fa-cart-plus').find('sup').length) {
                    var sup = document.createElement('sup');
                    $('.fa-cart-plus').html(sup);
                }
                $('.fa-cart-plus sup').html(recipeCount);
                // recipeTotalPrice = floatCalculate.floatAdd(recipeTotalPrice, price);
                $('.totle').html(recipeTotalPrice);
                if (recipeTotalPrice >= sendPrice) {
                    $('.low-price').val("立即结算").addClass('active');
                    //注册支付按钮pay 
                    btnPayreg();
                } else {
                    // var diffPrice = floatCalculate.floatSub(sendPrice, recipeTotalPrice);
                    $('.low-price').val("差" + diffPrice + "元起送").removeClass('active');
                }
                try {
                    storage.setItem('foodData', JSON.stringify(foodData));
                } catch (e) {

                }
            });
        });

        // });
        //初始化购物车显示
        var initShopCart = function () {
            var foodDataStr = storage.getItem('foodData') ? storage.getItem('foodData') : '{}';
            var cartString = escape(foodDataStr);
            $.ajax({
                url: api['getCartItemsUrl'],
                data: {
                    "cartString": cartString
                },
                success: function (data) {
                    if (data) {
                        $('.f-footer').append(data);
                        sendPrice = parseFloat($('#sendPrice').val());
                        recipeCount = parseInt($('#recipeCount').val());
                        recipeTotalPrice = parseFloat($('#recipeTotalPrice').val());
                        shopcartBtn = document.getElementsByClassName('btn-shopcart');

                        //注册购物车按钮事件
                        funregCart();
                        //注册支付按钮pay 
                        btnPayreg();
                    }
                }
            });
        }

        //注册结算Btn
        var btnPayreg = function () {
            $('.low-price').on('click', function () {
                var $self = $(this);
                if ($self.hasClass('active')) {
                    var foodDataStr = storage.getItem('foodData') ? storage.getItem('foodData') : '{}';
                    var cartStringEN = escape(foodDataStr);
                    setTimeout(function () {
                        window.location.replace(mobileDomain+"/CanYin/WaiMai/WaiMaiOrder/ConfirmOrderView?cartString=" + cartStringEN);
                    }, 1000);

                    // window.open("/CanYin/WaiMai/WaiMaiOrder/ConfirmOrderView?cartString=" + escape(cartStringEn), '_self');
                }
            });
        };
        //页面加载执行
        $(function () {
            initShopCart();

        });

        //点击购物车按钮
        var funregCart = function () {
            $(shopcartBtn).on('click', function () {
                var cartString = escape(JSON.stringify(foodData));
                window.open(api.toShopcart + "?cartString=" + cartString, '_self');
                //$.ajax({
                //    url: api.toShopcart,
                //    data: {"cartString": cartString },
                //    dataType: "json",
                //    success: function (data) {
                //        var isdata = data;
                //    }
                //});
            });
        };

        //菜品分类切换
        $('.switch-classify li').on('click', function () {
            var self = this;
            var classifyid = $(self).data('classifyid');
            $(self).addClass('cur').siblings().removeClass('cur');
            dataWaiter.show();
            $.ajax({
                url: mobileDomain+'/waimai/' + classifyid,
                success: function (data) {
                    if (data) { //有菜品数据
                        dataWaiter.close();
                        $('.f-list').find('.tips').hide();
                        $('#foodList').html(data);
                        window.scrollTo(0, 0);
                    } else { //无菜品数据
                        dataWaiter.close();
                        $('#foodList').empty();
                        //$('.f-list').append("<div class=\"tips\"><div><p>该分类下无菜品，请查看其它分类</p></div></div>");
                        $('.f-list').find('.tips').show();
                    }
                }
            });
        });

        //分享
        shareBtn.parentNode.addEventListener(click, function () {
            var ua = navigator.userAgent.toLowerCase();
            // content = document.querySelector('.topics-content');
            if (ua.indexOf('micromessenger') > 0) {
                require('global/wxShare').show();
            } else {
                var share = require('global/share.js');
                share.shareConfig = {
                    summary: location.href
                };
                share.show();
            }
        }, false);

    };
});
