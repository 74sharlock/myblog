define(function(require,exports,module){
    function shareMask(){
        var self = this;
        self.node = document.querySelector('.wx-shareMask') || self.createDom();
        self.node.addEventListener('touchend',function(){
            self.close();
        },false);
    }

    shareMask.prototype.createDom = function(){
        var shareMask = document.createElement('div');
        shareMask.className = 'wx-shareMask hidden';
        shareMask.innerHTML = '<img src="/resource/images/0.png">';
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
            var target = e.target;
            target.classList.add('hidden');
            target.removeEventListener('transitionend',h,false);
            target.removeEventListener('webkitTransitionEnd',h,false);
        }
    };

    return new shareMask();
});