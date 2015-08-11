define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        $.fn.wpTooltips = function(string,styleName,coustomClass){
            if($.type(string)!=='string'){
                return ;
            }
            var that = this;
            styleName = styleName || '';
            coustomClass = (coustomClass ? ' ' + coustomClass : '');
            that.addClass('wp ' + styleName + coustomClass ).append('<div class="wp-tooltip">' + string + '</div>');
            return that;
        };
    })($);
});