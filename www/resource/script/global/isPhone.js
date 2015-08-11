/*区分手机端和PC端*/
/*add By sharlock*/
/*2015-04-01*/
define(function(require, exports, module){
    return function () {
        var userAgentInfo = navigator.userAgent,
            Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],
            flag = false,
            l = Agents.length;
        while (l--) {
            if (userAgentInfo.indexOf(Agents[l]) > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    };
});