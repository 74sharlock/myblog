define(function(require,exprots,module){
    module.exports = {
        animationEnd : 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        transitionEnd : 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend',
        click: function(){
            if(require('global').isPhone()){
                return 'touchend';
            } else {
                return 'click';
            }
        }
    };
});