define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        var $body = $('body');
        $body.on('click','.cselectorLinkbtn',function(){
            var d = require('dialog'),
                $a = $(this),
                rUrl = encodeURIComponent($a.data('url')),
                dg = d({
                    width: 500,
                    height: 300,
                    title: '链接选择器',
                    content: '<iframe src="/linkurl.aspx?rurl=' + rUrl + '" id="linkList" name="beautification" width="100%" height="100%" allowtransparency="yes" frameborder="no" scrolling="yes"></iframe>',
                    cancel: function () {
                    },
                    onshow: function () {
                        var self = this,
                            linkList = document.getElementById('linkList'), //获取那个要命的iframe
                            thatWindow = linkList.contentWindow; //获取要命的iframe下面又一个要命的window对象
                        thatWindow.onload = function () {
                            var submitBtn = this.document.getElementById('submit'), //获取到原来的提交按钮
                                //获取到原来的提交按钮改变的隐藏域
                                url = this.document.getElementById('url');
                            //隐藏原来的提交按钮以显得我们好像重做了切图一样,其实没有
                            submitBtn.style.display = 'none';
                            //给那个提交按钮重新注册一个事件,并且在有值的情况下传到咱的窗口
                            submitBtn.addEventListener('click', function () {
                                if(url.value !== 'undefined'){
                                    var urlArr = url.value.split('|'), l = urlArr.length; //拆分zjs的链接
                                    //返回一个数组给咱窗口
                                    self.close([
                                        //那个要命的现在已经看不到的提交按钮
                                        submitBtn,
                                        //使用要命窗口作用域下的强大的zjs的强大的getvals方法查字典最后得出结论
                                        thatWindow.zjs.getvals("linkType1", urlArr[1]) || '选择连接',
                                        //返回实际的链接
                                        urlArr[l-1]
                                    ]);
                                }
                            }, false);
                        };
                    },
                    ok: function () {
                        var linkList = document.getElementById('linkList'), //还是获取那个要命的iframe
                            thisWindow = linkList.contentWindow, //又获取一遍那个要命的iframe下面那个要命的window对象
                            submitBtn = thisWindow.document.getElementById('submit');//最后是那个提交按钮
                        submitBtn.click(); //最后相当无可奈何地模拟点击了一下它
                        return false;
                    },
                    okValue: '确定',
                    cancelValue: '取消'
                });
            dg.showModal();
            dg.addEventListener('close', function () {
                //终于拿到了想要的东西
                var val = this.returnValue;
                $('span', $a).text(val[1]).parent().attr('data-url',val[2]);//给链接选择器加上data-url链接,同时改变下里面的显示内容
                dg.remove();
            }, false);
        });
        $body.on('click','.cselectorImageSelect',function(){
            var d = require('dialog'),
                $a = $(this),
                ctype = $a.data('ctype') || '',
                cid = $a.data('cid') || '',
                title = (ctype != "icon" && ctype != "welcome") ? '图片选择器' : false,
                dg = d({
                    width: 800,
                    height: 500,
                    title: title,
                    content: '<iframe src="/cfinder.aspx?type=' + ctype + '&id=' + cid +'" id="imgSelect" name="beautification" width="100%" height="100%" allowtransparency="yes" frameborder="no" scrolling="yes"></iframe>',
                    cancel: function () {
                    },
                    onshow: function () {
                        var self = this,
                            imgSelect = document.getElementById('imgSelect'), //获取那个要命的iframe
                            thatWindow = imgSelect.contentWindow; //获取要命的iframe下面又一个要命的window对象
                        thatWindow.onload = function () {
                            var name = this.document.getElementById('name'), //获取到要命window下面的被选中图片对象的name
                                src = this.document.getElementById('path'), //获取到要命window下面的被选中图片对象的src
                                SaveBtn = this.document.getElementById('savePic'),  //获取到要命window下面的saveBtn
                                bulkImageUpload = this.document.getElementById('bulkImageUpload'), //获取到要命window下面的多图上传按钮
                                file = this.document.getElementById('file'), //获取要命window下面的单图上传表单
                                //获取到要命window下面的另一个疯狂的iframe,为什么需要这么多的iframe??
                                upload_target = this.document.getElementById('upload_target');
                            bulkImageUpload.style.display = 'none'; //暂时隐藏多图上传.其实多图上传也没啥用.
                            //给那个提交按钮重新注册一个点击事件,并且在有值的情况下传到咱的window
                            SaveBtn.addEventListener('click', function () {
                                if(src.value && src.value !== 'undefined'){
                                    self.close([
                                        name.value,
                                        src.value
                                    ]);
                                }
                            }, false);
                            //监听表单change,彼时当目标iframe加载完成,关闭弹窗,然后传个值给咱的window
                            file.addEventListener('change',function(){
                                upload_target.onload = null;
                                upload_target.onload = function(){
                                    var imgInfo = this.contentWindow.document.body.innerHTML,
                                        imgSrc = $.parseJSON(imgInfo).path,
                                        imgname = $.parseJSON(imgInfo).name,
                                        message = $.parseJSON(imgInfo).Message,
                                        callback = $a.attr('callback') || $a.attr('callback').find('img');
                                    self.close([
                                        imgname,
                                        imgSrc
                                    ]);
                                    if(callback){ //如果有回调,回调之,同时把关键数据传过去
                                        window[callback]($a,imgSrc,imgname);
                                    }
                                };
                            },false);
                        };
                    },
                    ok: function () {
                        var imgSelect = document.getElementById('imgSelect'), //还是获取那个要命的iframe
                            thisWindow = imgSelect.contentWindow, //又获取一遍那个要命的iframe下面那个要命的window对象
                            SaveBtn = thisWindow.document.getElementById('savePic');//然后就是那个保存按钮
                        SaveBtn.click(); //最后相当无可奈何地模拟点击了一下它
                        return false;
                    },
                    okValue: '确定',
                    cancelValue: '取消'
                });
            dg.showModal();
            dg.addEventListener('close', function () {
                //终于拿到了想要的东西
                var val = this.returnValue, callback = $a.attr('callback') || $a.find('img').attr('callback');
                if($a[0].nodeName.toLowerCase() === 'img'){ //如果对象本身就是个图片,直接设置属性
                    $a.attr({
                        src:val[1],
                        title:val[0]
                    });
                } else {
                    try {   //如果对象本身不是图片,尝试在它的孩儿中找个图片然后设置属性;
                        $a.attr({title:val[0]}).find('img').attr({src:val[1]});
                    } catch (ex){

                    }
                }
                if(callback){ //如果有回调,回调之,同时把关键数据传过去
                    window[callback]($a,val[1],val[0]);
                }
                dg.remove();
            }, false);
        });
    })($);
});