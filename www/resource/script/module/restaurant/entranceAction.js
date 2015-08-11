define(function(require, exports, module) {
    return function() {
        var G = window[window.module], $ = require('$'), D = require('plugin/m_dialog.js');
        G.SaoYiDao = function () {
            D.alert('<div style="text-align:center">打开微信扫一扫餐桌上的二维码进行点餐。</div>');
            return false;
        };
    };
});