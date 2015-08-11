define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        $.fn.animationStep = function(options){
            var that = this,
                animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                animationMethod = arguments[0];

            options = $.extend({
                name:null,
                duration : null,
                delay : null,
                count : null,
                direction : null,
                fn:function(){}
            },options);

            that.isAnimating = false;

            that.setStyle = function($item){
                var duration = options.duration || $item.data('animationDuration') || 1,
                    delay = $.type(options.delay) === 'number' ? options.delay : ($item.data('animationDelay') || 0),
                    count = options.count || $item.data('animationCount') || 1,
                    direction = options.direction || $item.data('animationDirection');
                if(duration){
                    duration = duration + 's';
                    $item.css({'animation-duration':duration,'-webkit-animation-duration':duration});
                }
                if(delay){
                    delay = delay + 's';
                    $item.css({'animation-delay':delay,'-webkit-animation-delay':delay});
                }
                if(direction){
                    $item.css({'animation-direction':direction,'-webkit-animation-direction':direction});
                }
                if(parseInt(count,10) !== 1){
                    $item[0].style.animationIterationCount = count;
                    $item[0].style.webkitAnimationIterationCount = count;
                }
                return $item;
            };

            that.play = function($item,animationName,fn){
                var name = animationMethod === 'leave' ? $item.data('animationLeave') : $item.data('animationName');
                name = animationName || options.name || name;
                $item = $item || that;
                if(name){
                    var className = 'animated ' + name;
                    that.isAnimating = !that.isAnimating;
                    that.setStyle($item).addClass(className).one(animationEnd,function(){
                        $(this).removeClass(className);
                        that.isAnimating = false;
                        if(fn){
                            fn();
                        }
                    });
                }
                return $item;
            };

            that.playAll = function(fn){
                var i = that.length;
                while(i--){
                    if( i === (that.length-1) && fn ){
                        that.play($(that[i]),null,fn);
                    }else{
                        that.play($(that[i]));
                    }
                }
                return that;
            };

            that.playAll(options.fn);

            return that;
        };
    })($);
});
