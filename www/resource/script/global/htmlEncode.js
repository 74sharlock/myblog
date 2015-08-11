/*html编码*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[value(字符串文本)]*/
define(function(require, exports, module){
    return function (value) {
        if(Object.prototype.toString.call(value) !== '[object String]'){
            return ;
        }
        var $ = require('jquery');
        return $('<div/>').text(value).html();
    };
});