define(function (require, exports, module) {
    return function () {
        var $ = require('jquery'),
            G = window[window.module],
            payway = parseInt($(document.querySelector('.pay-check')).data('payway')),
         isPhone = require('global/isPhone')(),
        click = isPhone ? 'touchend' : 'click';
        var dataWaiter = require('global/dataWaiter');
        var D = require('plugin/m_dialog.js');
        require('animationStep');

        $('.pay-type li').on(click, function () {
            var self = this;
            $(self).addClass('pay-check').siblings().removeClass('pay-check');
            payway = parseInt($(self).data('payway'));
        });



        G.submitOrder = function (orderId) {
            dataWaiter.show();
            $.ajax({
                url: mobileDomain + '/CanYin/TangShi/TangShiOrder/SubmitOrderCheckOut',
                data: { 'orderId': orderId,"payWay":payway },
                success: function (data) {
                    dataWaiter.close();
                        if (data&&data.ResponseId > 0) {
                            //提交成功1、现金支付 更新订单状态及文案信息 2、线上支付 跳转到结账
                            //todo
                            if (payway === 0) {//现金支付
                                D.alert("<div class='text-center'>提交成功，请联系服务员结账，谢谢合作！</div>");
                                window.location.href = mobileDomain + '/tangshi/order/detail/' + orderId;
                            } else {//线上支付
                                setTimeout(function() {
                                    window.location.href = mobileDomain + '/tangshi/order/pay/'+orderId;
                                },800);
                            }
                        } else {
                            D.alert("<div class='text-center'>提交结账信息失败，联系下服务员吧！</div>", 2000);
                        }
                }
            });
        };

        //$(function () {
        //    //非微信浏览器
        //    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1) {
        //        //移除微信支付
        //        if ($('.wx-pay')) {
        //            $('.wx-pay').remove();
        //        }
        //    }
        //});

    };
});