/*全局的swiper插件方法*/
/*add By sharlock*/
/*2015-04-01*/
define(function(require, exports, module){
    return function(){
        //获取所有className为swiper-container的容器
        var swiperContainer = document.querySelectorAll('.swiper-container'), swiperContainerLen = swiperContainer.length;
        //遍历使用swiper插件
        while (swiperContainerLen--) {
            var item = swiperContainer[swiperContainerLen],
                id = item.id;
            //如果使用了swiper-container容器,但是又不想使用插件,加上data-no-swiper="true"属性或者不写data-param属性则不会调用插件;
            if (item.getAttribute('data-no-swiper') === 'true' || !(item.getAttribute('data-param'))) {
                return;
            }
            require('sea_css');
            seajs.use('/resource/stylesheet/plugin/swiper3.05.min.css');
            //如果元素没id,给它弄个
            if (!id) {
                id = 'swiper' + new Date().getTime();
                item.id = id;
            }
            var paramArr = item.getAttribute('data-param').split(';'),
                paramArrLen = paramArr.length,
            //所有数字型的Api
                intKeyArr = ['autoplay', 'speed', 'freeModeMomentumRatio', 'freeModeMomentumBounceRatio', 'slidesPerView', 'slidesPerGroup', 'spaceBetween', 'slidesPerColumn', 'slidesPerColumn', 'longSwipesRatio', 'touchAngle', 'longSwipes', 'resistanceRatio', 'loopAdditionalSlides', 'loopedSlides', 'initialSlide'],
                param = {};
            while (paramArrLen--) {
                //拆分&&整合参数
                var p = paramArr[paramArrLen].split(':');
                //如果参数key是int型,把它的值转int型
                if (intKeyArr.indexOf(p[0]) >= 0) {
                    p[1] = parseInt(p[1], 10);
                }
                //如果参数值是字符串'false'或者字符串'true',转为布尔值
                if (p[1] === 'false') {
                    p[1] = false;
                }
                if (p[1] === 'true') {
                    p[1] = true;
                }
                //把键值对放到param中
                param[p[0]] = p[1];
            }
            //如果没有swiper队列,创建一下队列
            if (!window.swiperQueue) {
                window.swiperQueue = {};
            }
            //请求swiper插件
            require('swiper');
            //使用插件,传入id和对象param作为参数,并且加入队列;
            swiperQueue[id] = new Swiper('#' + id, param);
        }
    };
});