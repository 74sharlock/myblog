/*图片根据比例设置最大高度*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[dom(dom对象),proportion(宽高比)]*/
define(function(require, exports, module){
    return function (dom, proportion) {
        proportion = proportion || 1;
        var w = dom.clientWidth, self = this;
        dom.style.maxHeight = parseInt(w * proportion) + 'px';

        var k = function () {
            self.imgKeepProportion(dom, proportion);
            window.removeEventListener('resize', k, false);
        };

        window.addEventListener('resize', k, false);
    };
});