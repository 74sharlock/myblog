/**
 * 简易数据模板$.tpl
 * 作者:sharlock.H
 * 日期:2015-04-29 20:20
 * 依赖:jQuery
 * 作用:$.tpl()根据数据dataList最后会返回填充数据的一段html
 * 支持模块化
 *
 *
 * dataList:数据数组[{},{},{}]
 * jqueryObject:需要遍历的jQuery对象
 * queryAttrName:数据写入时查找的自定义属性(默认:data-query)
 * useLowCase:是否开启字段小写,开启后数据字段全部为小写(默认不开启)
 *
 *
 * [查询属性写法为data-query="text:name,val:name,html:name,attr:{data-id:id|src:path|href:url},css:{display:block}"]
 *
 *
 * 还有一种自定义处理数据的方法:
 * data-query="text:->'his name is ' + $data.name + '.H.'"
 * ->代表接下来的数据按照函数解析,其中$data代表当前遍历的这条数据,相当于text了(function($data){ return 'his name is ' + $data.name + '.H.';})(data)方法执行的结果(另一个参数$index代表当前数据在dataList中的索引)(如果存在三元表达式, 请将其中的:换成??, 否则会报错)
 *
 *
 * 另外如果没有dataList只有单条数据{},请使用$.tpl.queryData(queryAttrName,$scope,data)方法
 * 其中 [
 * queryAttrName 代表数据写入时查找的自定义属性
 * $scope 代表需要填充数据的jQuery对象
 * data 代表单条数据
 * ]
 * 最后返回填充后的jQuery对象,这时的jQuery对象会包在一个div中,可以直接用.html()方法获取到里面的html
 **/

'use strict';

(function (global, factory) {

    if (!global.document) {
        throw new Error('本方法只能在dom环境下使用...');
    }
    //如果存在模块化则模块化处理之
    //不存在模块化时,直接执行
    if (typeof define === 'function') {
        define('$tpl', ['jquery'], factory);
    } else {
        factory(global);
    }
})((typeof window !== 'undefined' ? window : this), function () {

    var jQuery = window.jQuery || (arguments[0] ? arguments[0]('jquery') : undefined);
    return (function ($) {
        if (typeof $ === 'undefined') {
            throw new Error('本方法依赖jQuery...');
        }
        var toString = Object.prototype.toString,
            fnParse = window.eval;


        $.tpl = function (dataList, jqueryObject, queryAttrName, useLowCase) {
            var i, len, item, html;
            html = '';

            queryAttrName = (queryAttrName || 'data-query');

            //遍历数据数组
            for (i = 0, len = dataList.length; i < len; i += 1) {
                if (useLowCase === true) {
                    item = {};
                    for (var k in dataList[i]) {
                        item[k.toLowerCase()] = dataList[i][k];
                    }
                } else {
                    item = dataList[i];
                }
                //每次变成属性写入后,拼接html字符串
                html += queryData(item, jqueryObject, queryAttrName, i).html();
            }
            //完成后返回整个字符串;
            return html;
        };

        //直接查询数据方法(适用于单个object)
        $.tpl.queryData = queryData;

        //版本号
        $.tpl.version = '0.1.0';

        //数据写入
        function queryData(item, $scope, queryAttrName, index){

            if ($scope.length) {
                //这里把jq对象包装一下,防止漏掉自身属性
                $scope = $('<div>' + $scope.prop('outerHTML') + '</div>');
            }
            queryAttrName = (queryAttrName || 'data-query');
            var $queryElements = $('['+ queryAttrName +']',$scope);
            var l = $queryElements.length, key;
            //遍历所有带插入数据的元素
            while (l--) {
                var $queryElement = $queryElements.eq(l);
                //按照逗号分拆多个属性为数组
                var queryArr = $queryElement.attr(queryAttrName).split(','),
                    queryArrlen = queryArr.length;
                //遍历所有属性方法+属性
                while (queryArrlen -- ) {
                    var queryItem = queryArr[queryArrlen],
                        queryItemArr,
                        method,
                        attrJson;
                    //如果存在{符号,认为是attr或者css方法
                    if (queryItem.indexOf('{') >= 0) {
                        //移除两边的大括号{},并且按照|拆分成数组
                        queryItemArr = queryItem.split('{');
                        method = queryItemArr[0].replace(':','');
                        queryItemArr = queryItemArr[1].replace('}','').split('|');

                        //创建一个对象字面量准备往里添加数据
                        attrJson = {};
                        var m = queryItemArr.length;
                        //遍历所有属性键值对
                        while (m--) {
                            //拆分键值对
                            var qArr = queryItemArr[m].split(':');
                            //如果值存在->,则认为是自定义处理,按照函数解析并且执行
                            if (qArr[1].indexOf('->') >= 0) {
                                qArr[1] = qArr[1].replace('->','').replace('??',':');
                                //fnParse = window.eval,解析字符串
                                qArr[1] = fnParse('(function($data,$index){return ' + qArr[1] + ';})('+ JSON.stringify(item) +', ' + index + ')');
                                //把解析后的值放入attrJson对象
                                attrJson[qArr[0]] = qArr[1];
                            } else {
                                //如果数据中存在指定字段,则存入attrJson对象,否则抛出异常
                                if(item.hasOwnProperty(qArr[1])){
                                    if(toString.call(item[qArr[1]]) === '[object Undefined]' || toString.call(item[qArr[1]]) === '[object Null]'){
                                        item[qArr[1]] = '';
                                    }
                                    attrJson[qArr[0]] = item[qArr[1]];
                                } else {
                                    throw new Error('没有在数据中找到' + qArr[1] + '字段,请仔细核对数据.注意字段的大小写.');
                                }
                            }
                        }
                        //执行多行属性设置方法
                        $queryElement[method](attrJson);
                    } else { //如果是普通的属性设置(text,val,html)
                        //按照:拆分成数组,method方法,key是当前数据对象的某个键值
                        queryItemArr = queryItem.split(':');
                        method = queryItemArr[0];
                        key = queryItemArr[1];
                        if (key.indexOf('->') >= 0) {
                            item[key] = fnParse('(function($data,$index){return ' + key.replace('->','').replace('??',':') + ';})('+ JSON.stringify(item) +', ' + index + ')');
                        } else {
                            //处理空字段
                            if(item.hasOwnProperty(key)){
                                if(toString.call(item[key]) === '[object Undefined]' || toString.call(item[key]) === '[object Null]'){
                                    item[key] = '';
                                }
                            } else {
                                throw new Error('没有在数据中找到' + key + '字段,请仔细核对数据.注意字段的大小写.');
                            }
                        }
                        $queryElement[method](String(item[key]));
                    }
                }
            }
            return $scope;
        }

        return $.tpl;
    })(jQuery);
});