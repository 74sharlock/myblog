define(function(require, exports, module){
    var forumCommentImageList = document.getElementById('forumCommentImageList'),
        li = forumCommentImageList.getElementsByTagName('li')[0];

    forumCommentImageList.removeChild(li);

    window.imageUploadList = [];

    function getDomClone(dom, callback){
        if(Object.prototype.toString.call(dom).indexOf('Element') > 0){
            var node = dom.nodeName.toLowerCase(), domClone = document.createElement(node);
            domClone.innerHTML = dom.innerHTML;
            if(callback){
                callback(domClone);
            }
            return domClone;
        }
    }

    return function(){
        var submitBtn = document.getElementById('submit'),
            addImgBtn = document.getElementById('addImgBtn'),
            imgUpload = document.getElementById('imgUpload');

        addImgBtn.addEventListener('click',function(){
            if(window.imageUploadList.length > 3){
                alert('抱歉，最多只能上传4张图片.');
                return ;
            }
            imgUpload.click();
        },false);

        imgUpload.addEventListener('change',function(e){
            var file = e.target.files[0], fr = new FileReader(), self = this;
            fr.onload = function(){
                uploadImg(file,this.result);
            };
            fr.readAsDataURL(file);
        },false);

        submitBtn.addEventListener('click',function(){
            require('global').bbsSubmit();
        },false);

        function uploadImg(file,localSource){
            var imgLi = getDomClone(li),
                bar = imgLi.querySelector('.progress-bar'),
                mask = imgLi.querySelector('.mask'),
                i = imgLi.querySelector('i'),
                url = require('api').imageUploadUrl('user');
            require('global').imgUpload({
                url:url,
                file:file,
                beforeUpload:function(){
                    if(forumCommentImageList.getElementsByTagName('li').length === 3){
                        addImgBtn.style.display = 'none';
                    }
                    forumCommentImageList.appendChild(imgLi);
                    imgLi.querySelector('img').src = localSource;
                    imgLi.querySelector('i').classList.add('hidden');
                    imgLi.querySelector('i').addEventListener('click',function(){
                        var index, x = 0, len = forumCommentImageList.getElementsByTagName('li').length;
                        for(; x < len; x++){
                            if(imgLi === forumCommentImageList.getElementsByTagName('li')[x]){
                                index = x;
                                break;
                            }
                        }
                        imgLi.parentNode.removeChild(imgLi);
                        window.imageUploadList.splice(index,1);
                        if(window.imageUploadList.length < 4){
                            addImgBtn.style.display = 'block';
                        }
                    });
                    imgUpload.value = '';
                },
                onSuccess:function(data){
                    var barCon = bar.parentNode;
                    barCon.style.opacity = '1';
                    barCon.style.transition = 'opacity 1s ease-in-out';
                    barCon.style.webkitTransitionProperty = 'opacity';
                    barCon.style.webkitTransitionDuration = '1s';
                    barCon.style.webkitTransitionTimingFunction = 'ease-in-out';
                    barCon.style.opacity = '0';
                    barCon.addEventListener('transitionend',function(){
                        barCon.parentNode.removeChild(barCon);
                        mask.style.display = 'none';
                    },false);
                    barCon.addEventListener('webkitTransitionEnd',function(){
                        barCon.parentNode.removeChild(barCon);
                        mask.style.display = 'none';
                    },false);
                    window.imageUploadList.push(data['path']);
                    i.classList.remove('hidden');
                },
                onProgress:function(num){
                    bar.setAttribute('aria-valuenow',num);
                    bar.style.width = num + '%';
                    bar.querySelector('.sr-only').innerHTML = num + '% 完成';
                }
            });
        }
    };
});