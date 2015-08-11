define(function (require, exprots, module) {
    var $ = require('jquery'),
        api = require('api');
    module.exports = {
        swipe: function (config) {

            config = $.extend({
                target: document,
                start: null,
                move: null,
                leftEnd: null,
                rightEnd: null,
                bottomEnd: null,
                topEnd: null,
                OffsetX: null
            }, config);

            if (config.target) {
                if (!!('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                    config.target.addEventListener('touchstart', function (event) {
                        var touch = event.targetTouches[0], //touches数组对象获得屏幕上所有的touch，取第一个touch
                            startPos = {
                                //取第一个touch的坐标值
                                x: touch.pageX,
                                y: touch.pageY,
                                time: +new Date
                            },
                            endPos = null,
                            isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
                        if (config.start) {
                            config.start(event);
                        }
                        this.addEventListener('touchmove', move, false);
                        this.addEventListener('touchend', end, false);

                        function move(e) {
                            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
                            if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
                            var touch = e.targetTouches[0];
                            endPos = {
                                x: touch.pageX - startPos.x,
                                y: touch.pageY - startPos.y
                            };
                            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
                            if (isScrolling === 0) {
                                if (config.move) {
                                    config.move(event);
                                }
                                //event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
                            }
                        }

                        function end() {
                            var duration = +new Date - startPos.time; //滑动的持续时间
                            if (isScrolling === 0) { //当为水平滚动时
                                if (Number(duration) > 10 && endPos) {
                                    //判断是左移还是右移，当偏移量大于10时执行
                                    var w = config.offsetX || parseInt(window.clientWidth / 3);
                                    if (endPos.x > w) {
                                        if (config.rightEnd) {
                                            config.rightEnd();
                                        }
                                    } else if (endPos.x < -w) {
                                        if (config.leftEnd) {
                                            config.leftEnd();
                                        }
                                    }
                                }
                            } else if (isScrolling === 1) {
                                if (endPos.y > 20) {
                                    if (config.bottomEnd) {
                                        config.bottomEnd();
                                    }
                                } else if (config.topEnd) {
                                    config.topEnd();
                                }
                            }
                            //解绑事件
                            this.removeEventListener('touchmove', move, false);
                            this.removeEventListener('touchend', end, false);
                        }
                    }, false);
                }
            }
        },

        //全局的swiper插件方法
        swpier: function () {

            //获取所有className为swiper-container的容器
            var swiperContainer = document.querySelectorAll('.swiper-container'), swiperContainerLen = swiperContainer.length;
            //遍历使用swiper插件
            while (swiperContainerLen--) {
                var item = swiperContainer[swiperContainerLen],
                    id = item.id;
                //如果使用了swiper-container容器,但是又不想使用插件,加上data-no-swiper="true"属性或者不写data-param属性则不会调用插件;
                if (item.getAttribute('data-no-swiper') === 'true' || !(item.getAttribute('data-param'))) {
                    return;
                }
                require('sea_css');
                seajs.use('/resource/stylesheet/plugin/swiper3.05.min.css');
                //如果元素没id,给它弄个
                if (!id) {
                    id = 'swiper' + new Date().getTime();
                    item.id = id;
                }
                var paramArr = item.getAttribute('data-param').split(';'),
                    paramArrLen = paramArr.length,
                    //所有数字型的Api
                    intKeyArr = ['autopaly', 'speed', 'freeModeMomentumRatio', 'freeModeMomentumBounceRatio', 'slidesPerView', 'slidesPerGroup', 'spaceBetween', 'slidesPerColumn', 'slidesPerColumn', 'longSwipesRatio', 'touchAngle', 'longSwipes', 'resistanceRatio', 'loopAdditionalSlides', 'loopedSlides', 'initialSlide'],
                    param = {};
                while (paramArrLen--) {
                    //拆分&&整合参数
                    var p = paramArr[paramArrLen].split(':');
                    //如果参数key是int型,把它的值转int型
                    if (intKeyArr.indexOf(p[0]) > 0) {
                        p[1] = parseInt(p[1], 10);
                    }
                    //如果参数值是字符串'false'或者字符串'true',转为布尔值
                    if (p[1] === 'false') {
                        p[1] = false;
                    }
                    if (p[1] === 'true') {
                        p[1] = true;
                    }
                    //把键值对放到param中
                    param[p[0]] = p[1];
                }
                //如果没有swiper队列,创建一下队列
                if (!window.swiperQueue) {
                    window.swiperQueue = {};
                }
                //请求swiper插件
                require('swiper');
                //使用插件,传入id和对象param作为参数,并且加入队列;
                swiperQueue[id] = new Swiper('#' + id, param);
            }
        },
        //图片根据比例设置最大高度
        imgKeepProportion: function (dom, proportion) {
            proportion = proportion || 1;
            var w = dom.clientWidth, self = this;
            dom.style.maxHeight = parseInt(w * proportion) + 'px';

            var k = function () {
                self.imgKeepProportion(dom, proportion);
                window.removeEventListener('resize', k, false);
            };

            window.addEventListener('resize', k, false);
        },
        //go-top
        goTop: function () {
            $('html,body').animate({ scrollTop: 0 });
            $('.page').animate({ scrollTop: 0 });
        },

        //点赞
        praise: function (id, callback) {
            $.ajax({
                url: api.praiseUrl(id),
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        //html编码
        htmlEncode: function (value) {
            return $('<div/>').text(value).html();
        },
        //html解码
        htmlDecode: function (value) {
            return $('<div/>').html(value).text();
        },
        //清除html代码
        removeHTML: function (html) {
            html = html.replace(/<(.[^>]*)>/gi, "");
            html = html.replace(/[ \f\n\t\v]+/g, "");
            return html;
        },
        //信息 评论提交
        infoReviewPost: function (postData, callback) {
            $.ajax({
                url: api.infoReviewUrl,
                data: postData,
                dataType: "json",
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        //信息 评论提交
        communityReplyPost: function (postData, callback) {
            $.ajax({
                url: api.communityreplyUrl,
                data: postData,
                dataType: "json",
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },

        //区分手机端和PC端
        isPhone: function () {
            var userAgentInfo = navigator.userAgent,
                Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],
                flag = false,
                l = Agents.length;
            while (l--) {
                if (userAgentInfo.indexOf(Agents[l]) > 0) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },

        //论坛帖子提交 (callback:发布成功之后的回调)
        bbsSubmit: function (callback) {
            var inputs = document.querySelectorAll('.form-data'),
                l = inputs.length,
                content = document.querySelector('[name=Content]').value,
                cId = document.getElementById('CategoryId').value,
                fm = new FormData();
            while (l--) {
                var key = inputs[l].name, val = inputs[l].value, placeholder = inputs[l].getAttribute('placeholder');
                if (val === '') {
                    alert('请填写' + placeholder);
                    return;
                } else {
                    fm.append(key, this.htmlEncode(val));
                }
            }
            content = this.htmlEncode(this.htmlEncode(content));
            if (window.imageUploadList[0]) {
                var i = 0, len = window.imageUploadList.length;
                content += '&lt;span class="imageList"&gt;';
                for (; i < len ; i++) {
                    content += '&lt;img src="' + window.imageUploadList[i] + '"&gt;';
                }
                content += '&lt;/span&gt;';
            }
            fm.append('Content', content);
            var mask = document.createElement('div');
            mask.className = 'add-mask';
            document.body.appendChild(mask);
            var xhr = new XMLHttpRequest(),
                hrefPrefix = location.protocol + '//' + location.host + '/',
                api = require('api'),
                url = hrefPrefix + api.forumAddUrl(cId);
            xhr.onload = function () {
                var res = xhr.responseText;
                if (Object.prototype.toString.call(res) === '[object String]') {
                    res = JSON.parse(res);
                }
                if (res['ResponseID'] === 0) {
                    if (callback) {
                        callback();
                    } else {
                        window.location.href = hrefPrefix + api.forumDetailUrl(res['Data']['Id']);
                    }
                } else {
                    alert(res['Message']);
                }
            };
            xhr.open('post', url, true);
            xhr.send(fm);
        },

        //文件上传(参数options是对象字面量)
        //参数:意义--参数类型
        //url:上传地址(必须)--string
        //file:文件对象(必须)--object
        //fileType:支持的文件类型--array
        //onTypeError:类型不被支持时的回调--function
        //outOfSize:超出文件大小时的回调--function
        //beforeUpload:上传前的回调--function
        //onProgress:上传中的回调--function(num)--num是当前进度(百分比数字,不含%,保留两位小数)
        //onSuccess:上传成功后的回调--function(data)--data是服务器返回数据(已经转为json)
        imgUpload: function (options) {
            var xhr = new XMLHttpRequest(),
                api = require('api'),
                fm = new FormData(),
                fileType = Object.prototype.toString.call(options['fileType']) === '[object Array]' ? options['fileType'] : ['jpeg', 'png', 'gif'],
                error = true,
                fileSize = options['fileSize'] || 1024 * 1024;
            if (options['file']) {
                var len = fileType.length;
                while (len--) {
                    if (options['file'].type.indexOf(fileType[len]) > 0) {
                        error = false;
                        break;
                    }
                }
                if (error) {
                    if (options['onTypeError']) {
                        options['onTypeError']();
                    } else {
                        alert('您上传的图片类型不被支持.');
                    }
                    return;
                }
                if (options['file'].size > fileSize) {
                    if (options['outOfSize']) {
                        options['outOfSize']();
                    } else {
                        alert('您上传的图片太大,请上传' + fileSize / 1024 / 1024 + 'M以内的图片');
                    }
                    return;
                }
                if (options['beforeUpload']) {
                    options['beforeUpload']();
                }
                fm.append('file', options['file']);
                xhr.onload = function () {
                    var res = xhr.responseText;
                    if (Object.prototype.toString.call(res) === '[object String]') {
                        res = JSON.parse(res);
                    }
                    if (res['path']) {
                        if (options['onSuccess']) {
                            options['onSuccess'](res);
                        }
                    } else {
                        alert('上传失败,请稍后再试.');
                    }
                };
                if (options['onProgress']) {
                    xhr.upload.onprogress = function (event) {
                        options['onProgress']((event.loaded * 100 / event.total).toFixed(2));
                    };
                }
                xhr.open('post', options['url'], true);
                xhr.send(fm);
            }
        },
        //获取URL参数
        getUrlParam: function (method, x_window) {
            if (!method) {
                method = 'search';
            }
            else if (method !== 'search' && method !== 'hash') {
                return {};
            }
            var param = ((x_window || window).location[method].length ? (x_window || window).location[method].substring(1) : ''),
                json = {},
                items = param.length ? param.split('&') : [],
                item = null,
                name = null,
                val = null,
                l = items.length;
            for (var i = 0; i < l; i++) {
                item = items[i].split('=');
                name = item[0];
                val = item[1];
                if (name.length) {
                    json[name] = val;
                }
            }
            return json;
        }
    }
});