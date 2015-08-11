define(function(require, exports, module) {
    var $ = require('jquery');
    return (function($) {
        $.fn.picturePreview = function() {
            var allitems = this;
            if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > 0) {
                var urls = [], current = "";
                allitems.each(function (e) {
                    urls.push($(this).data("src"));
                });
                allitems.click(function () {
                    current = $(this).data("src");
                    if (WeixinJSBridge) {
                        WeixinJSBridge.invoke('imagePreview', {
                            'current': current,
                            'urls': urls
                        });
                    } else {
                        getTouchTouch(this);
                    }
                });

            } else {
                getTouchTouch(this);
            }
            function getTouchTouch(obj) {
                $("head").append('<link href="/resource/stylesheet/plugin/touchTouch.css" rel="stylesheet" />');
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '/resource/script/plugin/picturePreview/jquery.touchTouch.js?t=' + new Date().getTime();
                document.getElementsByTagName('head')[0].appendChild(script);
                script.onload = function () {
                    $(obj).touchTouch();
                };
            }
        };
    })($);
});



