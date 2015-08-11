//这里定义一些全局通用的函数，该文件会被自动加载
'use strict';

//格式化时间戳
Date.prototype.dateFormat = function(format){
    if(typeof format === 'undefined'){
        return format;
    }
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};


global.dateFormat = function(time, format){
    return new Date(isNumber(time) ? time : parseInt(time, 10)).dateFormat(format);
};

global.now = function(){
    return new Date().getTime();
};
