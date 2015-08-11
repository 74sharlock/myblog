define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            floatCalculate = require('global/floatCalculate'),
            addCartBtn = document.getElementById('add-cart'),
            shopcartBtn = document.getElementsByClassName('btn-shopcart'),
            storage = window.localStorage,
            dataWaiter = require('global/dataWaiter'),
            $ = require('$'),
            shareBtn = document.querySelector('.fa-share-alt'),
            isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click',
            foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {}, cartString = escape(JSON.stringify(foodData));
        require('global/swiper.js')();
        require('plugin/jquery.picturePreview.js');
        var recipeCount = 0; //购物车菜品数量
        var sendPrice = 0; //餐厅起送价
        var recipeTotalPrice = 0; //菜品总价格
        //购物车逻辑
        $('.add-cart').on(click, function () {
            var $this = $(this),
                id = parseInt($this.data('id')),
                price = parseFloat($this.data('price'));
            if ($this.hasClass('btn-hui')) {
                return;
            }
            if (foodData[id]) {
                foodData[id]++;
            } else {
                foodData[id] = 1;
            }
            recipeCount += 1;
            if (!$('.fa-cart-plus').find('sup').length) {
                var sup = document.createElement('sup');
                $('.fa-cart-plus').html(sup);
            }
            $('.fa-cart-plus sup').html(recipeCount);
            recipeTotalPrice = floatCalculate.floatAdd(recipeTotalPrice, price);
            $('.totle').html(recipeTotalPrice);
            if (recipeTotalPrice >= sendPrice) {
                $('.low-price').val("立即结算").addClass('active');
                //注册支付按钮pay 
                btnPayreg();
            } else {
                var diffPrice = floatCalculate.floatSub(sendPrice, recipeTotalPrice);
                $('.low-price').val("差" + diffPrice + "元起送").removeClass('active');
            }

            try {
                storage.setItem('foodData', JSON.stringify(foodData));
                //$this.addClass('btn-hui').val('已加入点餐车').html('已加入点餐车'); //已加入购物车
                $('.fa-cart-plus').find('sup').addClass('sc2');
                setTimeout(function() {
                    $('.fa-cart-plus').find('sup').removeClass('sc2');
                },600);
            } catch (e) {

            }
        });
        //初始化购物车显示
        var initShopCart = function() {
            foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {};
            var cartStr = escape(JSON.stringify(foodData));
            $.ajax({
                url: mobileDomain+'/CanYin/WaiMai/WaiMairecipe/ShopCartItem',
                data: { "cartString": cartStr },
                success: function(data) {
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
        };

        //注册结算Btn
        var btnPayreg = function () {
            $('.low-price').on(click, function () {
                var $self = $(this);
                if ($self.hasClass('active')) {
                    foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {};
                    var cartStringEn = escape(JSON.stringify(foodData));
                    setTimeout(function() {
                        window.location.replace(mobileDomain+"/CanYin/WaiMai/WaiMaiOrder/ConfirmOrderView?cartString=" + cartStringEn);
                    },1500);
                    //window.open("/CanYin/WaiMai/WaiMaiOrder/ConfirmOrderView?cartString=" + cartStringEn, '_self');
                }
            });
        };

        //评论加载更多
        $('.load-more').on(click, function () {
            var $next = $('.item-next');
            if ($next[0]) {
                $('.mainContaine-mask').show();
                $.post($next.val(), {}, function (data) {
                    $(data).appendTo($('.comment'));
                    $next.remove();
                    $next = $('.item-next');
                    if ($next.val() != "") {
                        $('.load-more').appendTo($('.comment'));
                    } else {
                        $('.load-more').remove();
                    }
                });
            }
        });

       

        $(function () {
            initShopCart();
           
            $('.mainContaine-mask').hide();
            $('.c-img').each(function() {
                $('img', this).picturePreview();
            });
            $('.food-img li[data-src]').not('.swiper-slide-duplicate').picturePreview();
            //if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > 0) {
            //    $("li[data-src]").click(function () {
            //        var srcList = [],
            //            src = $(this).data('src'),
            //            $parent = $(this).parent(),
            //            $span = $('li', $parent),
            //            i = 0,
            //            len = $span.length;
            //        for (; i < len; i++) {
            //            srcList.push($span.eq(i).data('src'));
            //        }
            //        if (WeixinJSBridge) {
            //            WeixinJSBridge.invoke('imagePreview', {
            //                'current': src,
            //                'urls': srcList
            //            });
            //        }
            //    });
            //} else {
            //    require('plugin/jquery.touchTouch.js');
            //    $('.food-img li[data-src]').touchTouch();
            //}

        });

       

        //点击购物车按钮
        var funregCart = function () {
            $(shopcartBtn).on(click, function () {
                var cartString = escape(storage.getItem('foodData'));
                setTimeout(function () {
                    window.open(api.toShopcart + "?cartString=" + cartString, '_self');
                }, 1000);

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