define(function(require, exports, module){
    return function() {
        var G = window[window.module], $ = require('$'), D = require('plugin/m_dialog.js'), dataWaiter = require('global/dataWaiter');
        G.userLogin = function () {
            dataWaiter.show();
            $.post(
               mobileDomain+ '/waimai/order/OrderMasterLogin',
                { pwd: $('#pwd').val() },
                function (data) {
                    if (data.State) {
                        dataWaiter.close();
                        D.tips('<div style="text-align:center">登陆成功</div>', 2000, function () {
                            var arr = location.href.split('prevUrl=');
                            if (arr[1]) {
                                location.href = decodeURIComponent(arr[1]);
                            } else {
                                location.href =mobileDomain+ '/waimai/order/orderMasterQuery';
                            }
                        });
                    } else {
                        dataWaiter.close();
                        D.alert(data.Message);
                    }
                   
                }
            );
        };
        G.ordeQuery = function () {
            dataWaiter.show();
            $.post(
              mobileDomain+ '/waimai/order/OrderMasterQuery',
               { orderNo: $('#orderNo').val() },
               function (data) {
                   if (data.State) {
                       location.href =mobileDomain+ '/waimai/order/managerdetail/' + data.id;
                   } else {
                       dataWaiter.close();
                       D.alert(data.Message);
                   }

               }
           );
        };
    };
});