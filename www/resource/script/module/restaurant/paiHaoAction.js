define(function(require, exports, module){
    return function() {
        var G, $, $selectors, $timer, $seats,
            $ = require('$'), D = require('plugin/m_dialog.js'), dataWaiter = require('global/dataWaiter');
        G = window[window.module];
        G.getVerifyCode = function (o) {
            var tel = $('#Phone').val();
            var reg = /^1\d{10}$/;
            if (!reg.test(tel)) {
                D.alert('<div style="text-align:center">请输入正确的手机号码。</div>');
                return false;
            }
            D.tips('<div style="text-align:center">发送验证码成功！');
            var iNow = 59,
                timer;
            $(o).addClass('disabled');
            timer = setInterval(function() {
                if (iNow === 0) {
                    clearInterval(timer);
                    $(o).removeClass('disabled').html('获取');
                } else {
                    $(o).html(iNow + '秒后获取');
                    iNow--;
                }
            }, 1000);
            $.post(mobileDomain + '/canyin/TangShi/TangShiMenu/SendSmsVerifyCode', { tel: tel, codeType: 'TangShiArranging' });
            return false;
        };
        G.PaiHao = function () {
            
            var tableType = $('input[name="tableType"]:checked').val();
            if (!tableType || tableType == "") {
                D.alert('<div style="text-align:center">请选择就餐类型。</div>');
                return false;
            }
            var param =
            {
                "TableClassId": tableType
            };

            if ($('#Phone').length > 0) {
                var tel = $('#Phone').val();
                var reg = /^1\d{10}$/;
                if (!reg.test(tel)) {
                    D.alert('<div style="text-align:center">请输入正确的手机号码。</div>');
                    return false;
                }
                var verifyCode = $("#VerifyCode").val();
                if (verifyCode == "") {
                    D.alert('<div style="text-align:center">验证码不能为空。</div>');
                    return false;
                }
                var phoneParam = {
                    "Phone": tel,
                    "VerifyCode": verifyCode
                };
                $.extend(param, phoneParam);
            }
            dataWaiter.show();
            $.post(
                mobileDomain + '/paihao/GetNumber',
                param,
                function(data) {
                    if (!data.State) {
                        dataWaiter.close();
                        D.alert(data.Message);
                        return false;
                    } else {
                        dataWaiter.close();
                        D.tips('<div style="text-align:center">取号成功！</div>', 2000, function() {
                            location.href = mobileDomain + '/paihao/detail/' + data.id;
                        });
                        return true;
                    }
                });
            return false;
        };
    };
});