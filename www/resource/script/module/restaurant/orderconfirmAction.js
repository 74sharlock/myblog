define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            dataWaiter = require('global/dataWaiter'),
            storage = window.localStorage,
            payconfirmBtn = document.getElementsByClassName('pay-confirm'),
            $ = require('$'),
            Alert = require('global/alert.js'),
            foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {},
            cartString = JSON.stringify(foodData),
            payway = $('.card .pay-check').data("payway") || 0,
            sendActId = parseInt($('.order-activity .pay-check').data("activityid")) || 0,//满送活动id
            customerInfo = document.querySelector('.customer-info'),
            customerTel = document.querySelector('.customer-phone'),
            customerAddr = document.querySelector('.customer-address'),
            orderRemark = document.querySelector('.order-remark');

        var addOrderLog = function(orderid, reduce, firstFree, totalPrice, memberPrice) {
            if (!orderid) return;
            $.ajax({
                url: mobileDomain+"/CanYin/WaiMai/WaiMaiOrder/AddOrderDetailLog",
                data: { "orderid": orderid, "reduce": reduce, "firstFree": firstFree, "totalPrice": totalPrice, "memberPrice": memberPrice },
                success: function(data) {
                    
                }
        });

        };

        //提交订单
        $(payconfirmBtn).on('click', function () {
            if (!storage.getItem('foodData')) {
                Alert("点餐车异常，请重新加入点餐车", 2000, true, true);
                setTimeout(function () {
                    window.location = mobileDomain+"/waimai";
                }, 1000);
                return;
            }
            var cartString = escape(storage.getItem('foodData'));
            var tel = $(customerTel).val(), addr = $(customerAddr).val(), remark = $(orderRemark).val();
            if (!tel || tel.length > 20) {
                Alert("请确保输入了正确的电话号码", 2000, true, true);
                return;
            }
            if (!addr || addr.length > 250) {
                Alert("请输入最大长度为250个字符的地址", 2000, true, true);
                return;
            }
            $(payconfirmBtn).addClass('disabled');
            dataWaiter.show();
            $.ajax({
                url: api.submitOrder,
                data: { "cartString": cartString, "ConsigneeTel": tel, "Address": addr, "Remark": remark, "PayWay": payway, "FullSendActivityId": sendActId },
                dataType: "json",
                success: function (data) {
                    if (data.orderId && data.orderId > 0) {
                        dataWaiter.close();
                        Alert(data.Message, 2000, true, true);
                        //清空购物车本地存储
                        window.localStorage.removeItem('foodData');
                        //todo: 向商家推送
                        $.get('/AdminUI/Public/Remind/Warn?orderId=' + data.orderId);
                        //添加Log
                        addOrderLog(data.orderId, data.reduce, data.firstFree, data.totalPrice, data.memberPrice);

                        if (payway === 0) {//货到付款 跳转至订单详情页
                            window.location = mobileDomain+"/waimai/Order/detail/" + data.orderId;

                        } else {//在线支付
                            window.location = mobileDomain+"/waimai/Order/Pay/" + data.orderId;

                        }
                        $(payconfirmBtn).removeClass('disabled');
                    } else if (data.orderId === 0) {
                        dataWaiter.close();
                        Alert(data.Message, 2000, true, true);
                        setTimeout(function () {
                            window.location =mobileDomain+ "/waimai";
                        }, 2000);
                    }
                    else if (data.orderId === -1) {
                        dataWaiter.close();
                        Alert(data.Message, 2000, true, true);
                        $(payconfirmBtn).removeClass('disabled');
                    }
                }
            });
        });

        //切换支付方式
        $('.card li').on('click', function () {
            var self = this;
            $(self).addClass('pay-check').siblings().removeClass('pay-check');
            payway = $(self).data('payway');
        });
        //切换参加活动
        $('.order-activity li').on('click', function () {
            var self = this;
            $(self).addClass('pay-check').siblings().removeClass('pay-check');
            sendActId = $(self).data('activityid');
        });
    };
});