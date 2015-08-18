window.seajs.config({ //全局配置
    'base':'/resource/script/',
    'alias': {
        'jquery':'lib/jquery.js',
        '$':'lib/jquery.js',
        'bsJs':'lib/bootstrap.min.js',
        'api':'map/api.js',
        'sea_css':'lib/seajs-css.js'
    }
});

//(function(){
//    //阻止UC左右滑
//    var control = navigator.control || {};
//    if (control.gesture) {
//        control.gesture(false);
//    }
//})();

R(function(){
    window.module = document.body.gas('data-module');
    if(module){

        //模块命名空间,请将全局方法挂载到模块命名空间下
        if(typeof window[window.module] === 'undefined'){
            window[window.module] = {};
        }
        if(document.body.gas('data-active') === 'true'){
            seajs.use('module/'+ module + '/main');
        }
    }
});