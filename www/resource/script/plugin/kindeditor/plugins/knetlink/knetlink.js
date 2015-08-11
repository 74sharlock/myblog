KindEditor.plugin('knetlink', function (K) {
    var self = this, name = 'knetlink', lang = self.lang(name + '.');
    self.clickToolbar(name, function () {
        zjs.openurl({
            title: self.lang(name),
            owidth: "600px",
            oheight: "400px",
            openurl: "/linkurl.aspx",
            returns: "url",
            callback: function (data) {
                var urlval = data[0];
                if (urlval == "") return;
                var keType = "";
                if (urlval.indexOf("mylink|") > -1) {
                    var link = urlval.split('|');
                    if (link[1] == "6") {
                        urlval = "http://wpa.qq.com/msgrd?v=3&uin=" + link[6] + "&site=qq&menu=yes";
                        keType = "_blank";
                    } else {
                        urlval = link[6];
                    }
                }
                self.exec('createlink', urlval, keType).focus();
            }
        });
    });

});