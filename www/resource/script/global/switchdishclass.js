define(function(require,exports,module){
    return function(options){
        var switchClassifyBtn = options['loadMoreBtn'] || document.querySelector('.switch-classify');
        var isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click',
            dataWaiter = require('global/dataWaiter');
        if (switchClassifyBtn) {
            switchClassifyBtn.addEventListener(click, function () {
                var next = options['nextItem'] || document.querySelector('.item-next'),
                    input = next ? next.querySelector('input') : null,
                    val = input ? input.value : null;
                var $self = this;
                var classfyId = $self.data("classifyid");
                var url = "/waimai/"+classfyId;
                if (classfyId) {
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
                    xhr.open('post', url, true);
                    xhr.send();
                } else {
                    var noDataItem = options['noDataItem'] || document.querySelector('.no-data-2');
                    if(noDataItem){
                        if(noDataItem.classList.contains('active')){
                            noDataItem.classList.remove('active');
                            setTimeout(function(){
                                noDataItem.classList.add('active');
                            }, 1500);
                            if ($('.load-more')) {
                                $('.load-more').first().remove();
                            }
                        }
                    }
                }
            },false);
        }
    };
});