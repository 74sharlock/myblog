KindEditor.plugin('knetimage', function (K) {
    var self = this, name = 'knetimage', lang = self.lang(name + '.');
    self.clickToolbar(name, function () { 
        zjs.openurl({
            title: self.lang(name),
            owidth: "960px",
            oheight: "560px",           
            openurl: "/cfinder.aspx?type=user&batch=1",
            returns: "path",
            callback: function (imgList) {
                var imgsArr = imgList[0].split(',');
                for (img in imgsArr) {
                    self.exec('insertimage', imgsArr[img], "", "", "", "", "").focus();
                }
              //  if (data[0] == "") return;
               // self.exec('insertimage', data[0], data[1], "", "", "", "").focus();
            }
        });
    });

});