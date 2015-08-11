define(function(require, exports, module) {
    return function() {
        var api = require('api'),
            G = window[window.module],
            D = require('plugin/m_dialog.js'),
            dataWaiter = require('global/dataWaiter'),
            $ = require('$');

        G['finishOrder'] = function (orderId) {

            if (!orderId) {
                D.alert("<div class='text-center'>订单有问题，建议在电脑端更改状态！</div>");
                return;
            }

            D.confirm("确定完成该订单的交易？",function() {
            
                $.ajax({
                    url: mobileDomain+'/CanYin/WaiMai/WaiMaiOrder/FinishOrder',
                    data: { 'orderId': orderId },
                    success: function (data) {
                        if (data) {
                            if (data.Id>0) {
                                D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                                //确认成功  刷新页面
                                window.location.reload();
                            } else {
                                D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                                return;
                            }
                            
                        }
                    }
                });

        });

        };

        //注册取消Btn
        G['cancelOrderBtn'] = function () {
            var cancelDiv = $('.cancel-wrapper');
            if (cancelDiv.length>0) {
                cancelDiv.show();
            }
        };

        //商家确认取消订单
        G['confirmCancel'] = function (orderId) {
            var cancelReason = $('#cancelReason').val();
            if (!cancelReason) {
                D.alert("<div class='text-center'>请输入取消原因！</div>");
                return;
            }
            dataWaiter.show();
            $.ajax({
                url:mobileDomain+ '/CanYin/WaiMai/WaiMaiOrder/CancelOrder',
                data: { 'orderId': orderId, 'cancelReson': cancelReason },
                success: function (data) {
                    dataWaiter.close();
                    if (data) {
                        if (data.Id > 0) {//取消成功
                            $('.cancel-wrapper').hide();
                            D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                            window.location.reload();
                        }
                        D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                    }
                }
            });
        };


    };
});