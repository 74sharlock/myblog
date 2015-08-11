define(function(require, exports, module) {
    return function() {
        var api = require('api'),
            D = require('plugin/m_dialog.js'),
            cancelOrderBtn = document.getElementById('order-cancel'),
            dataWaiter = require('global/dataWaiter'),
            Alert = require('global/alert.js'),
            $ = require('$');

        //注册结算Btn
        var btnCancelreg = function () {
            $('.order-cancel').on('click', function () {
                var $self = $(this);
                var orderId = $self.data('id');

                D.confirm("<div class='text-center'>亲要取消该订单么？</div>",
                    function () {
                        D.close();
                        dataWaiter.show();
                        $.ajax({
                            url: mobileDomain+'/CanYin/WaiMai/WaiMaiOrder/CancelOrder',
                            data: { "orderId": orderId },
                            dataType: "json",
                            success: function (data) {
                                dataWaiter.close();
                                if (data) {
                                   
                                    if (data.State == 'Y') {//成功
                                        D.tips("<div class='text-center'>取消成功！</div>", 2000);
                                        $('.order-state').html();
                                        $('.order-state').html("<img src=\"/resource/images/fail.gif\" alt=\"订单已取消\"><span>订单已取消</span>");
                                    } else if (data.State == 'N') {
                                        D.tips("<div class='text-center'>取消失败！</div>", 2000);
                                    }
                                }
                            }
                        });

                    });

            });
        };

        $(function() {
            btnCancelreg();

        });

    };
});