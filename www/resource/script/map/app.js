define(function (require, exprots, module) {
    module.exports = {
        AppCall: function (action, params) {
            var href = "appcall://" + action;
            var paramsArry = [];
            for (var param in params) {
                paramsArry.push(param + "=" + encodeURI(params[param] || ""));
            }
            if (paramsArry.length) href += "?" + paramsArry.join("&");
            location.href = href;
        },
        /*发送邮件*/
        mail: function (to, content) {
            location.href = "mailto:" + encodeURI(to) + "?body=" + encodeURI(content || "");
        },
        /*呼叫电话*/
        callPhone: function (phone) {
            location.href = "tel:" + phone;
        },
        /* 分享（微博等）*/
        appShare: function (content) {
            this.AppCall("share", { content: content });
        },
        /*地图定位*/
        openmap: function (latitude, longitude, zoom, mark) {
            this.AppCall("openMap", { latitude: latitude, longitude: longitude, zoom: zoom, mark: mark });
        },
        /*版本检查*/
        update: function () {
            this.AppCall("update", {});
        }
    }
});
