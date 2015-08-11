define(function (require, exports, module) {
    var maxImageLength = 3,
        imgList = document.querySelector('.img-list'),
        li = imgList.getElementsByTagName('li')[0];
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
    imgList.removeChild(li);
    window.imageUploadList = [];

    return function () {
        var api = require('api'),
            cancelOrderBtn = document.getElementById('order-cancel'),
            dataWaiter = require('global/dataWaiter'),
            Alert = require('global/alert.js'),
            $ = require('$'), star = 5, imgUpload = document.getElementById('imgUpload');


        $('.btn').on('click', function () {           
            $(".img-list li i").trigger('click');
            $("#Content").val("");
            $('.uc-comment').show('slow');
            $('.uc-comment .v-f-star i').removeClass('on');
            for (var i = 0; i < 5; i++) {               
                $($('.uc-comment .v-f-star i').get(i)).addClass('on');
            }
            $(".uc-comment .c-ok").data("id", $(this).data("id"));
        });
        $('.uc-comment .c-cancel').on('click', function () {
            $('.uc-comment').hide('slow');
            $(".uc-comment .c-ok").data("id", "");
           
        });
        $('.uc-comment .c-ok').on('click', function () {
            var recipeId = parseInt($(this).data("id"));
            if (recipeId > 0) {
                var content = $.trim($("#Content").val());
                if (content == "") {
                    Alert('评价内容不能为空！', 2000, true, true);
                    return false;
                } else {
                    $.post(
                       mobileDomain+ "/CanYin/WaiMai/WaiMairecipe/comment",
                        { orderId: $("#orderId").val(), RecipeId: recipeId, Content: require('global/htmlEncode')(content), Score: star, Images: window.imageUploadList.join(',') },
                        function(data) {
                            if (data.Id > 0) {
                                $('.uc-comment').hide('slow');
                                $('#btn' + recipeId).remove();
                                Alert('评价成功！', 2000, true, true);
                            } else {
                                $('.uc-comment').hide('slow');
                                Alert('评价失败！', 2000, true, true);
                            }
                        }
                    );
                }
            }
            else {
                Alert('参数有误！', 2000, true, true);
            }
        });
        /*评分*/
        $('.uc-comment .v-f-star i').on('click', function() {
            var _index = $(this).index();
            star = _index + 1;
            $('.uc-comment .v-f-star i').removeClass('on');
            while (_index > -1) {
                $($('.uc-comment .v-f-star i').get(_index)).addClass('on');
                _index--;
            }
           
        });
       


        imgUpload.addEventListener('change', function (e) {
            var file = e.target.files[0], fr = new FileReader(), self = this;
            fr.onload = function () {
                uploadImg(file, this.result);
            };
            fr.readAsDataURL(file);
        }, false);

        function uploadImg(file, localSource) {
            var imgLi = getDomClone(li),
                bar = imgLi.querySelector('.progress-bar'),
                mask = imgLi.querySelector('.mask'),
                i = imgLi.querySelector('i'),
                url = require('api').imageUploadByUserUrl;
            require('global').imgUpload({
                url: url,
                file: file,
                fileSize: 3145728,
                outOfSize: function () {
                    Alert('您上传的图片太大!', 2000, true, true);
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