window.mobileDomain = '/CanYin';
window.seajs.config({ //全局配置
    'base':'/resource/script/',
    'alias': {
        'global':'global.js',
        'jquery':'lib/jquery.js',
        '$':'lib/jquery.js',
        'animationStep':'plugin/animation_step.js',
        'unobtrusive':'plugin/jquery.validate.unobtrusive.min.js',
        'mobilebone':'lib/mobilebone.js',
        'bsJs':'lib/bootstrap.min.js',
        'api':'map/api.js',
        'sea_css':'lib/seajs-css.js',
        'lang':'map/lang.js',
        'data': 'map/data.js',
        'app': 'map/app.js',
        'iScroll':'lib/iscroll.js',
        'event':'map/event.js',
        'swiper':'plugin/swiper3.05.jquery.min.js',
        'dialog': 'plugin/dialog',
        '$tpl': 'plugin/tpl.min.js'
    }
});

(function(){
    //阻止UC左右滑
    var control = navigator.control || {};
    if (control.gesture) {
        control.gesture(false);
    }
})();

window.onload = function(){
    window.module = document.getElementsByTagName('body')[0].getAttribute('data-module');
    if(module){

        //模块命名空间,请将全局方法挂载到模块命名空间下
        if(typeof window[window.module] === 'undefined'){
            window[window.module] = {};
        }

        seajs.use('module/'+ module + '/main',function(){

        });
    }
};