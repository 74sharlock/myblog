define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            dataWaiter = require('global/dataWaiter'),
            buyCardBtn = document.getElementsByClassName('buycard'),
            $ = require('$'),
            Alert = require('global/alert.js');

        //提交订单
        $(buyCardBtn).on('click', function () {
            var self = $(this);
            var cardTypeId = self.data("typeid") || 0;
            if (cardTypeId) {
                dataWaiter.show();
                $.ajax({
                    url: mobileDomain+"/CanYin/WaiMai/WaiMaimember/SubmitMemberCard",
                    data: { "cardTypeId": cardTypeId },
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.cardId > 0) {
                                dataWaiter.close();
                                if (data.BuyType == "free") {//免费领取会员卡 不需要跳转支付
                                    Alert("成功领取会员卡", 1500, true, true);
                                    setTimeout(function () {
                                        window.location =mobileDomain+ "/CanYin/WaiMai/WaiMaimember/MemberCardDetail?id=" + data.cardId;
                                    }, 1000);
                                } else {//跳转至会员卡支付页面
                                    setTimeout(function () {
                                        window.location = mobileDomain+"/CanYin/WaiMai/WaiMaimember/BuyMemberCard?typeCardId=" + cardTypeId + "&id=" + data.cardId;
                                    }, 1000);
                                }

                            }
                            else if (data.cardId === -1) {
                                dataWaiter.close();
                                Alert(data.Message, 2000, true, true);
                            }
                        }

                    }
                });

            }
        });

    };
});