/*全局赞*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[id(赞对象的id),callback(赞完的回调附带赞请求回来的数据)]*/
define(function(require, exports, module){
    return function (id, callback) {
        var $ = require('jquery');
        $.ajax({
            url: require('api').praiseUrl(id),
            success: function (data) {
                if (callback) {
                    callback(data);
                }
            }
        });
    };
});