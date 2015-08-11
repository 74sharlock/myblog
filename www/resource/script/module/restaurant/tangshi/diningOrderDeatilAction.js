define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            $ = require('$'),
            D = require('plugin/m_dialog.js'),
            dataWaiter = require('global/dataWaiter');
        require('animationStep') ,star = 5, imgUpload = document.getElementById('imgUpload');

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

        //订单催菜
        G.remindDish = function (self, orderId) {
            self = $(self) || window.event.target;
            //获取该菜单的菜品
            if (!orderId) {
                D.alert("<div class='text-center'>订单异常，亲检查下！^_^</div>");
                return false;
            }
            dataWaiter.show();
            $.ajax({
                url: mobileDomain + '/CanYin/TangShi/TangShiTable/RemindeDish',
                data: { "orderId": orderId },
                success: function (data) {
                    dataWaiter.close();
                    if (data) {
                    

                        if (data.ResponseId > 0) {
                            //催菜成功
                            D.alert("<div class='text-center'>" + data.Message + "</div>");
                           //催菜成功
                            self.addClass('res-btn-disabled').html('已催菜');
                        } else {
                            D.alert("<div class='text-center'>" + data.Message + "</div>");
                            return;
                        }
                    }
                }
            });


            return true;
        };

        //订单加菜
        G.addDish = function (orderId) {
          
            if (!orderId) {
                D.alert("<div class='text-center'>订单异常，请联系服务员！^_^</div>");
                return;
            }
            dataWaiter.close();

            setTimeout(
                function() {
                    window.location.href = mobileDomain + "/tangshi/0/3?orderId=" + orderId; //跳转到堂食首页 加菜
                },800
            );

        };

        //跳转到结账页面 去结账
        G.goCheckOut = function (orderId) {
            
            if (!orderId) {
                D.alert("<div class='text-center'>订单异常，请联系服务员！^_^</div>");
                return;
            }
            dataWaiter.show();
            setTimeout(
                function () {
                    window.location.href = mobileDomain + "/tangshi/order/checkout/" + orderId; //跳转到结账页面
                }, 800
            );

        };

        //跳转到支付页面-去支付
        G.goToPay= function (orderId) {
            
            if (!orderId) {
                D.alert("<div class='text-center'>订单异常，请联系服务员！^_^</div>");
                return;
            }
            dataWaiter.show();
            setTimeout(
                function () {
                    window.location.href = mobileDomain + "/tangshi/order/pay/" + orderId; //跳转到支付页面
                }, 800
            );

        };

        $('.comment-btn').on('click', function () {
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
                    D.alert('<div class="text-center">评价内容不能为空！</div>');
                    return false;
                } else {
                    $.post(
                       mobileDomain + "/CanYin/WaiMai/WaiMairecipe/comment",
                        { orderId: $("#orderId").val(), RecipeId: recipeId, Content: require('global/htmlEncode')(content), Score: star, Images: window.imageUploadList.join(',') },
                        function (data) {
                            if (data.Id > 0) {
                                $('.uc-comment').hide('slow');
                                $('#btn' + recipeId).remove();
                                D.tips('<div class="text-center">评价成功！</div>', 2000);
                            } else {
                                $('.uc-comment').hide('slow');
                                D.alert('<div class="text-center">评价失败！</div>');
                            }
                        }
                    );
                }
            }
            else {
                D.alert('参数有误！');
            }
        });
        /*评分*/
        $('.uc-comment .v-f-star i').on('click', function () {
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
                    D.alert('您上传的图片太大!');
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