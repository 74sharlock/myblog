/*goTop*/
/*add By sharlock*/
/*2015-04-01*/
define(function(require, exports, module){
    return function () {
        var $ = require('jquery');
        $('html,body').animate({ scrollTop: 0 });
        $('.page').animate({ scrollTop: 0 });
    };
});