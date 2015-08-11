/*论坛帖子提交*/
/*add By sharlock*/
/*2015-04-01*/
/*param:[callback(发布成功之后的回调带赞请求回来的数据)]*/
define(function(require, exports, module){
    return function (callback) {
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
        var  htmlEncode = require('global/htmlEncode');
        content = htmlEncode(htmlEncode(content));
        if (window.imageUploadList && window.imageUploadList[0]) {
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
    };
});