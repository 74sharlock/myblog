define(function (require, exports, module) {

    var maxImageLength = 9,
        imgList = document.querySelector('.img-list'),
        li = imgList.getElementsByTagName('li')[0],
        looksBtn = document.getElementById('looksBtn'),
        $ = require('$'),
        Alert = require('global/alert.js');

    imgList.removeChild(li);
    require('global/insertAtCursor');

    window.imageUploadList = [];


    function getDomClone(dom, callback) {
        if (Object.prototype.toString.call(dom).indexOf('Element') > 0) {
            var node = dom.nodeName.toLowerCase(), domClone = document.createElement(node);
            domClone.innerHTML = dom.innerHTML;
            if (callback) {
                callback(domClone);
            }
            return domClone;
        }
    }

    window.submitData = function (opitions) {
        if (opitions.url) {
            var formData = window.getData();
            //表单验证
            var validForm = function validForm(formData) {
                if (!$.trim(formData.content).length) {
                    Alert('主题内容不可为空.', 2000 , true ,true);
                    return false;
                }
                if (formData.content.length>2000) {
                    Alert('主题内容字段长度不可超过2000.', 2000 , true ,true);
                    return false;
                }
                if (window.imageUploadList.length > 9) {
                    Alert('抱歉，最多只能上传9张图片.', 2000 , true ,true);
                    return false;
                }
                return true;
            };
            if (validForm(formData)) {
                $[opitions.method || 'post'](opitions.url, opitions.data || window.getData(), function (data) {
                    if ($.type(opitions.fn) === 'function') {
                        opitions.fn(data);
                    }
                });
            }
        }
    };

    window.getData = function () {
        var j = {};
        j['id'] = $('[name="Id"]').val();
        j['CommunityId'] = $('[name="CommunityId"]').val();
        j['content'] = require("global").htmlEncode($('[name="Content"]').val());
        j['isTop'] = $('[name="IsTop"]').is(':checked') ? 1 : 0;
        j['images'] = window.imageUploadList.join(',');
        return j;
    };

    return function () {
        var addImgBtn = document.getElementById('addImgBtn'),
            imgUpload = document.getElementById('imageUpload');

        imgUpload.addEventListener('change', function (e) {
            if (window.imageUploadList.length > maxImageLength) {
                Alert('抱歉，最多只能上传9张图片.', 2000 , true ,true);
                return;
            }
            var file = e.target.files[0], fr = new FileReader();
            if (file) {
                fr.onload = function () {
                    uploadImg(file, this.result);
                };
                fr.readAsDataURL(file);
            }
        }, false);

        seajs.use('bsJs',function(){
            $(looksBtn)['popover']({
                title:'表情',
                html: true,
                content:$('.looks').html()
            });
            $('.icons-block').on('click','.chat-icon-list',function(){
                var icon = $(this).data('icon'), $topicsContent = $('#topicsContent'), maxLength = $topicsContent.attr('maxlength'),
                    val = $topicsContent.val(), valLength = val.length;
                if(valLength >= maxLength-4){
                    return ;
                }
                $topicsContent.insertAtCursor(icon);
            });
            $(document).on('click',function(e){
                if($(e.target).parents('.icons-block')[0]){
                    return false;
                }
                $(looksBtn)['popover']('hide');
            });
            if(top){
                $(top.document).on('click',function(){
                    $(looksBtn)['popover']('hide');
                });
            }
        });

        function uploadImg(file, localSource) {
            var imgLi = getDomClone(li),
                bar = imgLi.querySelector('.progress-bar'),
                mask = imgLi.querySelector('.mask'),
                i = imgLi.querySelector('i'),
                url = require('api').imageUploadUrl('user');
            require('global').imgUpload({
                url: url,
                file: file,
                fileSize:3145728,
                outOfSize:function(){
                    Alert('您上传的图片太大!', 2000 , true ,true);
                },
                beforeUpload: function () {
                    if (imgList.getElementsByTagName('li').length === maxImageLength) {
                        addImgBtn.style.display = 'none';
                    }
                    imgList.insertBefore(imgLi, addImgBtn);
                    imgLi.querySelector('img').src = localSource;
                    imgLi.querySelector('i').classList.add('hidden');
                    imgLi.querySelector('i').addEventListener('click', function () {
                        var index, x = 0, len = imgList.getElementsByTagName('li').length;
                        for (; x < len; x++) {
                            if (imgLi === imgList.getElementsByTagName('li')[x]) {
                                index = x;
                                break;
                            }
                        }
                        imgLi.parentNode.removeChild(imgLi);
                        window.imageUploadList.splice(index, 1);
                        if (window.imageUploadList.length < maxImageLength) {
                            addImgBtn.style.display = 'block';
                        }
                    });
                    imgUpload.value = '';
                },
                onSuccess: function (data) {
                    var barCon = bar.parentNode;
                    barCon.style.opacity = '1';
                    barCon.style.transition = 'opacity 1s ease-in-out';
                    barCon.style.webkitTransitionProperty = 'opacity';
                    barCon.style.webkitTransitionDuration = '1s';
                    barCon.style.webkitTransitionTimingFunction = 'ease-in-out';
                    barCon.style.opacity = '0';
                    barCon.addEventListener('transitionend', function () {
                        barCon.parentNode.removeChild(barCon);
                        mask.style.display = 'none';
                    }, false);
                    barCon.addEventListener('webkitTransitionEnd', function () {
                        barCon.parentNode.removeChild(barCon);
                        mask.style.display = 'none';
                    }, false);
                    window.imageUploadList.push(data['path']);
                    i.classList.remove('hidden');
                },
                onProgress: function (num) {
                    bar.setAttribute('aria-valuenow', num);
                    bar.style.width = num + '%';
                    bar.querySelector('.sr-only').innerHTML = num + '% 完成';
                }
            });
        }
    };
});