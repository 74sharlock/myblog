define(function(require, exports, module){
    var $ = require('jquery');
    return (function($){
        $.fn.createAttrPanel = function(){
            var that = this,
                $items = $('[data-attr]',that),
                l = $items.length,
                parseString = {},
                parseArray = {},
                parseCss = {},
                animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

            //todo:剩余的解析
            parseString = {
                text:function(){
                    var text = arguments[1].text();
                    return '<input type="text" class="form-control" style="margin-right: 15px" data-method="text" value="' + text + '">';
                },
                value:function(){
                    var val = arguments[1].val();
                    return '<input type="text" class="form-control" style="margin-right: 15px" data-method="val" value="' + val + '">';
                },
                href:function(){
                    var href = arguments[1].attr('href');
                    var title = zjs.getvals("linkType1", href.split('|')[1]) || "选择链接";
                    return '<input data-key="link" data-method="attr:href" name="link" type="hidden" class="cselectorLink" value="' + href + '"><a class="btn btn-primary cselectorLinkbtn" style="margin-right: 15px"><i class="icon-link"></i><span>' + title + '</span></a>';
                },
                src:function(){
                    var src = arguments[1].attr('src');
                    return '<label><i class="icon-picture"></i>更换' + arguments[0] + '</label><a class="imgCon"><input type="hidden" data-method="attr:src" value="' + src + '"><img src="' + src + '" height="100" class="cselectorImageSelect" ctype="user" callback="changeInputVal" data-callback-method="sharlock"></a>';
                }
            };

            //todo:剩余的解析
            parseArray = {
                css:function(){
                    var y = arguments[0].length, html = '';
                    while(y--){
                        html += parseCss[arguments[0][y]](arguments[1],arguments[2]);
                    }
                    return html;
                }
            };
            //todo:剩余的解析
            parseCss = {
                'background-color':function(){
                    var href = arguments[1].attr('href'), bgColor = getColor16(arguments[1][0].style.backgroundColor)[0];
                    window.bc = bgColor;
                    return '<label><i class="icon-th"></i>' + arguments[0] + '底色</label>' +
                        '<input type="text" class="form-control color" data-method="css:background-color" value="' + bgColor + '">';
                }
            };

            var $attrPanel = (function (){ //创建面板
                var $panel = $('<div class="attr-panel"></div>'), html = '', i = 0;
                for(;i<l;i++){
                    var $item = $($items[i]);
                    $item.attr('data-attr-index',i);
                    html += makeAttrWidget($item);
                }
                html += '<div class="scene-btn-area"><i class="pos-a icon-reply" title="返回页面属性"></i><a class="btn btn-warning wp" id="sceneReplay"><i class="icon-undo"></i>重播<div class="wp-tooltip">再看一次动画</div></a><a class="btn btn-danger" id="sceneAttrSubmit"><i class="icon-check"></i>提交</a></div>';
                $panel.html(html);
                return $panel;
            })();

            function makeAttrWidget($item){//单个面板累加
                var attrString = $item.data('attr'), attrName = $item.data('attrName'), id = $item.data('attrIndex'), html = '<div class="form-group" data-index="' + id + '">';
                if(attrString){
                    var attrGroup = attrString.split(','), z = attrGroup.length;
                    while(z--){
                        html += parseAttr(attrGroup[z],attrName,$item);
                    }
                    html += '</div>'
                }
                return html;
            }

            function parseAttr(string,attrName,$item){//单个面板解析
                if(string === ''){
                    return ;
                }
                if( string.indexOf(':') > 0 ){ //多级属性
                    var attrArr = string.split(':'), attrChild = attrArr[1].split('|');
                    return parseArray[attrArr[0]](attrChild,attrName,$item);
                }
                return parseString[string](attrName,$item);
            }

            function getColor16(color10){ //获取十六进制颜色
                var color16 = [];
                if(color10){
                    if(color10.indexOf('rgba(') === 0){
                        color10 = color10.replace('rgba(','').replace(')','');
                    }
                    if(color10.indexOf('rgb(') === 0){
                        color10 = color10.replace('rgb(','').replace(')','');
                    }
                    color10 = color10.split(',');
                    color10[3] = color10[3] || '1';
                    var r = parseInt(color10[0]).toString(16).length === 1 ? '0' + parseInt(color10[0]).toString(16) : parseInt(color10[0]).toString(16),
                        g = parseInt(color10[1]).toString(16).length === 1 ? '0' + parseInt(color10[1]).toString(16) : parseInt(color10[1]).toString(16),
                        b = parseInt(color10[2]).toString(16).length === 1 ? '0' + parseInt(color10[2]).toString(16) : parseInt(color10[2]).toString(16);
                    color16.push('#'+ r + g + b);
                    color16.push(color10[3]);
                }
                return color16;
            }

            function linkage($panel){ //表单联动
                loadJs('/js/jscolor.js',function(){
                    var event = arguments[1] || 'change';
                    $('[data-index] input',$panel).bind(event,function(){
                        var $this = $(this),
                            val = $this.val(),
                            $parent = $this.parents('.form-group'),
                            id = $parent.data('index'),
                            method = $this.data('method'),
                            $target = $('[data-attr-index="' + id + '"]');
                        if(method.indexOf(':') > 0){
                            method = method.split(':');
                            if(method[1] === 'background-color'){
                                val = '#' + val;
                            }
                            $target[method[0]](method[1],val);
                        } else {
                            $target[method](val);
                        }
                    });
                    window.jscolor.init();
                    window.changeInputVal = function(obj,src){
                        obj.prev('input').val(src).trigger('change');
                    };
                });
            }

            //todo:组装不同格式数据
            var makeData = {
                'json':function(){
                    var json = {};
                },
                'form':function(){

                }
            };

//        that.bindingData = function(data){
//            var l = data.length, k , x;
//            while(l--){
//                var json = data[l];
//                for(k in json){
//                    if($.type(json[k]) === 'string'){
//                        $('[data-attr-index="' + l + '"]',that)[k](json[k]);
//                        $('[data-index="' + l + '"] input[data-method="' + k + '"]',$attrPanel).val(json[k]);
//                    } else if($.type(json[k]) === 'object'){
//                        for(x in json[k]){
//                            var name = json[k];
//                            if(x.indexOf('color')>=0){
//                                $('[data-attr-index="' + l + '"]',that)[k](x,'#' + name[x]);
//                            } else {
//                                $('[data-attr-index="' + l + '"]',that)[k](x,name[x]);
//                            }
//                            $('[data-index="' + l + '"] input[data-method="' + name + ':' + x + '"]',$attrPanel).val(name[x]);
//                        }
//                    }
//                }
//            }
//        };

            that.insertTarget = function(container){ //插入指定目标元素
                //<iframe id="conAttr" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" src="/Designer/AddPage.aspx?id=88600"></iframe>
                $('.attr-panel',container).remove();
//            $('#conAttr').addClass('animated fadeOutLeftBig').one(animationEnd,function(){
//                $(this).hide().removeClass('animated fadeOutLeftBig');
//            });
                $('#conAttr').hide();
                if(arguments[1] && $.type(arguments[1]) === 'string'){
                    var className = 'animated ' + arguments[1];
                    $attrPanel.addClass(className).one(animationEnd,function(){
                        $(this).removeClass(className);
                    });
                }
                container.append($attrPanel);
                if(arguments[2] && $.type(arguments[2]) === 'function'){
                    arguments[2]();
                }
                linkage($attrPanel);
                return that;
            };

            //todo:其他数据类型的格式化解析
            that.getPanelData = function(method){//组装数据
                method = method || 'json';
                var $formGroup = $('.form-group',$attrPanel), l = $formGroup.length, data = [];
                while(l--){
                    var $item = $formGroup.eq(l),
                        $input = $('input',$item),
                        y = $input.length,
                        json = {};
                    while(y--){
                        var $i = $($input[y]),
                            key = $i.data('method'),
                            val = $i.val();
                        if(key.indexOf(':') > 0){
                            key = key.split(':');
                            json[key[0]] = {};
                            json[key[0]][key[1]] = val;
                        } else {
                            json[key] = val;
                        }
                    }
                    data.push(json);
                }
                return data.reverse();
            };

            return that;
        };
    })($);
});