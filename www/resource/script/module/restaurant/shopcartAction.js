define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            $ = require('$'),
            F = require('global/floatCalculate'),
            storage = window.localStorage,
            foodList = document.getElementById('foodList'),
            emptyCart = document.getElementsByClassName('go-pay'),
            settleBtn = document.getElementsByClassName('low-price'),
            totalCartRecipeCount = $('.post-price').find('.deal-f-count'),
            foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {}, cartString = JSON.stringify(foodData);
        var recipeCount = 0;//购物车菜品数量
        var sendPrice = 0;//餐厅起送价
        var recipeTotalPrice = 0;//菜品总价格

        //注册结算Btn
        var btnPayreg = function () {
            $('.low-price').on('click', function () {
                var $self = $(this);
                if ($self.hasClass('active')) {
                    var foodDataStr = storage.getItem('foodData') ? storage.getItem('foodData') : '{}';
                    var cartString = escape(foodDataStr);
                    window.open(mobileDomain+"/CanYin/WaiMai/WaiMaiOrder/ConfirmOrderView?cartString=" + cartString, '_self');
                }
            });
        };

        //购物车逻辑 添加菜品  减少菜品
        $(foodList).on('click', 'span i', function (e) {
            var $this = $(this),
                isPlus = $this.hasClass('plus'),
                $ptr = $this.parents('tr'),
                id = parseInt($ptr.data('id')),
                count = parseInt($ptr.find('.deal-f-count').html());
            price = parseFloat($ptr.data('price'));
            if (foodData[id]) {
                if (isPlus) {//添加
                    foodData[id]++;

                    //z执行动画之前进行数据的计算
                    recipeCount += 1;
                    recipeTotalPrice = F.floatAdd(recipeTotalPrice, price);
                    var diffPrice = F.floatSub(sendPrice, recipeTotalPrice);
                    count++;
                    /* 添加动画开始 */
                    e = e || window.event;
                    var pX = e.clientX,
                          pY = e.clientY,
                        aw = $("#ani_wrapper");
                    aw.stop();
                    aw.css({ 'left': pX - 20, "bottom": document.body.clientHeight - pY - 30, "display": "block", "opacity": 1 }).animate({
                        left: "1rem", bottom: "0.5rem", opacity: .1
                    }, 600, function () {
                        aw.hide();
                        /* 购物车逻辑开始 */
                        $('.totle').html(recipeTotalPrice);
                        if (recipeTotalPrice >= sendPrice) {
                            $('.low-price').val("立即结算").addClass('active');
                            //注册支付按钮pay 
                            btnPayreg();
                        } else {
                           // var diffPrice = F.floatSub(sendPrice, recipeTotalPrice);
                            $('.low-price').val("差" + diffPrice + "元起送").removeClass('active');
                        }
                        $ptr.find('.deal-f-count').html(count);
                        /* 购物车逻辑结束 */
                    });

                    /* 添加动画结束 */

                } else {//减少
                    if (foodData[id] > 1) {
                        foodData[id]--;
                        recipeCount -= 1;
                        $('.fa-cart-plus').val(recipeCount);
                        recipeTotalPrice = F.floatSub(recipeTotalPrice, price);
                        $('.totle').html(recipeTotalPrice);
                        if (recipeTotalPrice < sendPrice) {
                            var diffPrice = F.floatSub(sendPrice, recipeTotalPrice);
                            $('.low-price').val("还差" + diffPrice + "元起送").removeClass('active');
                        }
                        $ptr.find('.deal-f-count').html(--count);

                    } else {
                        foodData[id]--;
                        recipeCount -= 1;
                        recipeTotalPrice = F.floatSub(recipeTotalPrice, price);
                        $('.totle').html(recipeTotalPrice);
                        if (recipeTotalPrice < sendPrice) {
                            var diffPrice = F.floatSub(sendPrice, recipeTotalPrice);
                            $('.low-price').val("还差" + diffPrice + "元起送").removeClass('active');
                        }
                        $ptr.find('.deal-f-count').html(--count);

                        delete foodData[id];
                        storage.setItem('foodData', JSON.stringify(foodData));
                        $ptr.remove();
                        if (storage.foodData == "{}") {//购物车全部删除
                            $('#foodList').remove();
                            $('.deal').html($('.cart-emptycode').html());
                            $('.f-footer').remove();
                        }
                    }
                }
                $('.fa-cart-plus').find('sup').html(recipeCount);
                totalCartRecipeCount.html(recipeCount);
            } else {//减到0了
                if (isPlus) {
                    foodData[id] = 1;
                    recipeCount += 1;
                    $('.fa-cart-plus').val(recipeCount);
                    recipeTotalPrice = F.floatAdd(recipeTotalPrice, price);
                    $('.totle').val(recipeTotalPrice);
                    if (recipeTotalPrice >= sendPrice) {
                        $('.low-price').val("立即结算").addClass('active');
                        //注册支付按钮pay 
                        btnPayreg();
                    } else {
                        
                    }
                    $ptr.find('.deal-f-count').html(++count);
                    totalCartRecipeCount.html(recipeCount);
                } else {//删除节点
                    delete foodData[id];
                    storage.setItem('foodData', JSON.stringify(foodData));
                    $ptr.remove();
                    if (storage.foodData == "{}") {//购物车全部删除
                        $('#foodList').remove();
                        $('.deal').html($('.cart-emptycode').html());
                        $('.f-footer').remove();
                    }
                }
            }

            try {
                storage.setItem('foodData', JSON.stringify(foodData));
            } catch (e) {

            }
        });
        //购物车删除
        $('.del-recipe').on('click', function () {
            var $self = $(this);
            var $ptr = $self.parents('tr');
            var id = id = parseInt($ptr.data('id'));
            var currprice = parseFloat($ptr.data('price'));
            var currcount = parseInt($ptr.find('.deal-f-count').html());
            var subPrice = F.floatMul(currprice, currcount);
            var oldTotalPrice = parseFloat($('.totle').html());
            var newTotalPrice = F.floatSub(oldTotalPrice, subPrice);
            var oldTotalCount = parseInt($('.fa-cart-plus').find('sup').html());
            var newTotalCount = Math.abs(oldTotalCount - currcount);
            $('.totle').html(newTotalPrice);
            $('.fa-cart-plus').find('sup').html(newTotalCount);
            $('.post-price').find('.deal-f-count').html(newTotalCount);
            recipeCount -= currcount;
            //foodData.getItem(id);
            //foodData.removeItem(id);
            delete foodData[id];
            storage.setItem('foodData', JSON.stringify(foodData));
            $ptr.remove();
            if (storage.foodData=="{}") {//购物车全部删除
                $('#foodList').remove();
                $('.deal').html($('.cart-emptycode').html());
                $('.f-footer').remove();
            }
        });

        //初始化购物车显示
        var initShopCart = function () {
            var foodDataStr = storage.getItem('foodData') ? storage.getItem('foodData') : '{}';
            $.ajax({
                url: mobileDomain+'/CanYin/WaiMai/WaiMairecipe/ShopCartItem',
                data: { "cartString": escape(foodDataStr) },
                success: function (data) {
                    if (data) {
                        if ($('.f-footer').length) {
                            $('.f-footer').append(data);
                            sendPrice = parseFloat($('#sendPrice').val());
                            recipeCount = parseInt($('#recipeCount').val());
                            recipeTotalPrice = parseFloat($('#recipeTotalPrice').val());
                            settleBtn = document.getElementsByClassName('low-price');
                            btnPayreg();
                        }
                    }
                }
            });
        }

            initShopCart();

    };
});