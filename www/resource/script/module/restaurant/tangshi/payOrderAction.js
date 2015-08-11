define(function (require, exports, module) {
    return function () {
        var $ = require('jquery'),
            G = window[window.module],
            payway = parseInt($(document.querySelector('.pay-check')).data('paytype')),
         isPhone = require('global/isPhone')(),
        click = isPhone ? 'touchend' : 'click';

        $('.pay-type li').on(click, function () {
            var self = this;
            $(self).addClass('pay-check').siblings().removeClass('pay-check');
            payway = parseInt($(self).data('paytype'));
        });



        G.goPay = function (orderId) {
            if (payway === 1) { //微信
                window.location.replace("/Mobile/Product/NewWeixinPay.aspx?OrderNo=w" + orderId);
            } else if (payway === 2) { //支付宝
                window.location.replace("/Mobile/WapPay/Alipay.aspx?OrderNo=w" + orderId);
            } else if (payway === 3) { //银行卡
                window.location.replace("/Mobile/waimai/DiningOrderPay.aspx?id=" + orderId.toString() + "&pay=3");
            }
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