define(function(require,exports,module){
    return function(options){
        var loadMoreBtn = options['loadMoreBtn'] || document.querySelector('.load-more');
        var isPhone = require('global/isPhone')(),
            method = options['method'] || 'post',
            click = isPhone ? 'touchend' : 'click',
            dataWaiter = require('global/dataWaiter');
        if(loadMoreBtn){
            loadMoreBtn.addEventListener(click,function(){
                var next = options['nextItem'] || document.querySelector('.item-next'),
                    input = next ? next.querySelector('input') : null,
                    val = input ? input.value : null;
                if(val){
                    dataWaiter.show();
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function(){
                        var data = xhr.responseText;
                        dataWaiter.close();
                        if(options['callback']){
                            options.callback(data);
                        } else if(options.insertTarget) {
                            options.insertTarget.removeChild(next);
                            options.insertTarget.innerHTML += data;
                        }
                    };
                    xhr.open(method,val,true);
                    xhr.send();
                } else {
                    var noDataItem = options['noDataItem'] || document.querySelector('.no-data-2');
                    if(noDataItem){
                        if(noDataItem.classList.contains('active')){
                            noDataItem.classList.remove('active');
                            setTimeout(function(){
                                noDataItem.classList.add('active');
                            }, 1500);
                            if ($('.load-more')[0]) {
                                $('.load-more').first().remove();
                            }
                        }
                    }
                }
            },false);
        }
    };
});