/*文件上传(参数options是对象字面量)*/
/*add By sharlock*/
/*2015-04-01*/
/*
参数:意义--参数类型
url:上传地址(必须)--string
file:文件对象(必须)--object
fileType:支持的文件类型--array
onTypeError:类型不被支持时的回调--function
outOfSize:超出文件大小时的回调--function
beforeUpload:上传前的回调--function
onProgress:上传中的回调--function(num)--num是当前进度(百分比数字,不含%,保留两位小数)
onSuccess:上传成功后的回调--function(data)--data是服务器返回数据(已经转为json)
*/
exports.fileUpload = function (options) {
    var xhr = new XMLHttpRequest(),
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
                if (options['onError']) {
                    options['onError']();
                } else {
                    alert('上传失败,请稍后再试.');
                }
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
};