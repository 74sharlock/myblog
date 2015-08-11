/*获取URL参数*/
/*add By sharlock*/
/*2015-04-01*/
/*
param:[
    method(传入search获取search参数,传入hash获取hash参数,不填默认获取search参数),
    x_window(需要读取的窗口,抓取iframe window对象url参数专用,不填默认为当前window对象)
    ]
*/
define(function(require, exports, module){
    return function (method, x_window) {
        if (!method) {
            method = 'search';
        } else if (method !== 'search' && method !== 'hash') {
            return {};
        }
        var param = ((x_window || window).location[method].length ? (x_window || window).location[method].substring(1) : ''),
            json = {},
            items = param.length ? param.split('&') : [],
            item = null,
            name = null,
            val = null,
            l = items.length;
        for (var i = 0; i < l; i++) {
            item = items[i].split('=');
            name = item[0];
            val = item[1];
            if (name.length) {
                json[name] = val;
            }
        }
        return json;
    };
});