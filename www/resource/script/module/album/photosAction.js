define(function(require,exports,module){
    return function(){
        //照片遮罩浏览
        require('plugin/img.touch');
        var $photoList = $('.photo-list li');
        $photoList.touchTouch();
        //赞
        document.body.addEventListener('click',function(e){
            e = e || window.event;
            e.stopPropagation();
            var target = e.target || e.srcElement;
            if(target.parentNode && target.parentNode.classList.contains('praise')){
                target = target.parentNode;
            } else if(!(target.classList.contains('praise'))){
                return ;
            }
            var id = target.getAttribute('data-id');
            if(!window.localStorage.getItem('hasPraise'+id)){
                require('global').praise(id,function(data){
                    data = JSON.parse(data);
                    if(data['ResponseID'] === 0){
                        var count = parseInt(target.querySelector('span').innerHTML,10);
                        target.querySelector('span').innerHTML = (count + 1);
                        window.localStorage.setItem('hasPraise'+id,1);
                    }
                });
            }
            return false;
        }, false);

        var imgId = require('global').getUrlParam()['imgId'];
        if (imgId) {
            var img = document.querySelector('[data-id="' + imgId + '"] img');
            if (img) {
                img.click();
            }
        }
    };
});