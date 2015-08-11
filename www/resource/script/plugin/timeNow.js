define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        $.fn.timeNow = function(){
            var that = this,
                date = new Date(),
                H = date.getHours(),
                M = date.getMinutes(),
                S = date.getSeconds(),
                noon = 'AM',
                method = arguments[0];
            if(H > 12){
                H -= 12;
                noon = 'PM';
            }
            if(M < 10){
                M = '0' + M;
            }
            if(S < 10){
                S = '0' + S;
            }
            if(!method){
                method = "min";
            }
            this.TimeText = {
                'min':H + ' : ' + M + ' ' + noon,
                'sec':H + ' : ' + M + ' : ' + S + ' ' + noon
            };
            that.text(this.TimeText[method]);
            setTimeout(function(){
                $.fn.timeNow.call(that,method);
            },1000);
        };
    })($);
});