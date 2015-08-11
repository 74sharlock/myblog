define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            payorderBtn = document.getElementsByClassName('pay-confirm'),
            orderid = document.getElementById('orderId').value,
            $ = require('jquery'),
            Alert = require('global/alert.js'),
            G = window[window.module],
            paywayDiv = document.getElementsByClassName('pay-type'),
            payway = $(document.querySelector('.pay-check')).data('paytype'),
         isPhone = require('global/isPhone')(),
        click = isPhone ? 'touchend' : 'click';

        $('.pay-type li').on(click, function () {
            var self = this;
            $(self).addClass('pay-check').siblings().removeClass('pay-check');
            payway = $(self).data('paytype');
        });

        G.payOrder = function () {
               if (payway==1) {//微信
                window.location.replace("/Mobile/Product/NewWeixinPay.aspx?OrderNo=w" + orderid);
            } else if (payway == 2) {//支付宝
                window.location.replace("/Mobile/WapPay/Alipay.aspx?OrderNo=w" + orderid);
            } else if (payway == 3) {//银行卡
                window.location.replace("/Mobile/waimai/OrderPay.aspx?id=" + orderid.toString() + "&pay=3");
            }
        }


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