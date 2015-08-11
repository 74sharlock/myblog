/*清除html代码*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[html(字符串文本)]*/
define(function(require, exports, module){
    return function (html) {
        html = html.replace(/<(.[^>]*)>/gi, "");
        html = html.replace(/[ \f\n\t\v]+/g, "");
        return html;
    };
});