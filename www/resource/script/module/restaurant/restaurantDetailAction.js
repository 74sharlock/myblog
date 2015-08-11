define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            buycardBtn = document.getElementsByClassName('buycard'),
             $ = require('$'),
            isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click';

        //点击跳转购买会员卡
        var funregBugCard = function () {
            $(buycardBtn).on('click', function () {
                var self = $(this);
                var typeid = self.data('typeid') || 0;
                if (typeid) {
                    window.location.replace(mobileDomain+"/CanYin/WaiMai/WaiMaimember/MemberCardInfo?id=" + typeid);
                }

            });
        };


        $(function () {
            funregBugCard();
        });


    };
});