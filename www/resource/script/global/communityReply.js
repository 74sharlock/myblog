/*论坛帖子提交*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[callback(发布成功之后的回调带赞请求回来的数据)]*/
define(function (require, exports, module) {
    return function (postData, callback) {
        $.post(require("api").communityreplyUrl, postData, function (data) {
            if (callback) {
                callback(data);
            }
        });
    };
});