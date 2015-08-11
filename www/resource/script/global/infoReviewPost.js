/*评论提交*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[postData(评论信息),callback(评论提交完的回调附带赞请求回来的数据)]*/
define(function(require, exports, module){
    return function (postData, callback) {
        var $ = require('jquery');
        $.ajax({
            url: require('api').infoReviewUrl,
            data: postData,
            dataType: "json",
            success: function (data) {
                if (callback) {
                    callback(data);
                }
            }
        });
    };
});