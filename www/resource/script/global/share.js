define(function(require,exports,module){
    function shareMask(option){
        var self = this;
        self.shareConfig = option || {};
        self.node = document.querySelector('.shareMask') || self.createDom();
        self.node.addEventListener(require('global/isPhone')()?'touchend':'click',function(e){
            var target = e.target;
            if(target.classList.contains('shareBox') || target.parentNode.classList.contains('shareBox') || target.classList.contains('wx-qr-code')){
                return ;
            }
            if(target.nodeName === 'A'){
                var cmd = target.getAttribute('data-cmd'), uri = self.shareLink(cmd);
                if(cmd === 'weixin'){
                    var box = self.node.querySelector('.shareBox'),
                        div = document.createElement('div'),
                        image = document.createElement('img');
                    image.src = uri;
                    div.className = 'wx-qr-code';
                    box.classList.add('hidden');
                    div.appendChild(image);
                    self.node.appendChild(div);
                } else {
                    window.location = uri;
                }
                return ;
            }
            self.close();
            return false;
        },false);
    }

    shareMask.prototype.shareList = require('map/data')['shareList'];

    shareMask.prototype.shareLink = function(cmd){
        var title = this.shareConfig['title'] ? '&title=' + this.shareConfig['title'] : '',
            url = '&url=' + (this.shareConfig['url'] || window.location.href),
            summary = this.shareConfig['summary'] ? '&summary=' + this.shareConfig['summary'] : '',
            pic = this.shareConfig['pic'] ? '&src=' + this.shareConfig['pic'] : '',
            search = title + url + summary + pic;
        return 'http://api.bshare.cn/share/' + cmd + '?' + search;
    };

    shareMask.prototype.createDom = function(){
        var shareMask = document.createElement('div'),
            html = '<div class="shareBox">',
            shareList = this.shareList.reverse(),
            len = shareList.length;
        while(len--){
            html += '<div><a class="share-' + shareList[len]['className'] + '" data-cmd="' + shareList[len]['cmd'] + '"></a><span>' + shareList[len]['description'] + '</span></div>'
        }
        html += '</div>'
        shareMask.innerHTML = html;
        shareMask.className = 'shareMask hidden';
        document.body.appendChild(shareMask);
        return shareMask;
    };

    shareMask.prototype.show = function(){
        var self = this;
        if(!self.node){
            self.createDom();
        }
        if(self.node.classList.contains('hidden')){
            self.node.classList.remove('hidden');
            setTimeout(function(){
                self.node.classList.add('active');
            });
        }
        return this;
    };

    shareMask.prototype.remove = function(){
        var self = this;
        if(self.node){
            document.body.removeChild(self.node);
        }
        return this;
    };

    shareMask.prototype.close = function(){
        if(this.node){
            this.node.classList.remove('active');
            this.node.addEventListener('transitionend',h,false);
            this.node.addEventListener('webkitTransitionEnd',h,false);
        }

        function h(e){
            e.stopPropagation();
            var target = e.target, box = target.querySelector('.shareBox'), qrCode = target.querySelector('.wx-qr-code');
            target.classList.add('hidden');
            if(qrCode){
                target.removeChild(qrCode);
                box.classList.remove('hidden');
            }
            target.removeEventListener('transitionend',h,false);
            target.removeEventListener('webkitTransitionEnd',h,false);
        }
    };

    return new shareMask();
});