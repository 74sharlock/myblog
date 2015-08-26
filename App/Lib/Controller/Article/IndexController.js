// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = Controller("Article/BaseController", function() {
    'use strict';
    return {
      indexAction: function(cid) {
        var self;
        self = this;
        if (!isNaN(parseInt(cid))) {
          return D('article').where({
            cat: cid
          }).page(isNumber(parseInt(this.post('pageIndex'))) ? this.post('pageIndex') : 1).order('modifytime DESC').select().then(function(data) {
            self.assign('list', data);
            return self.fetch('chips/articleList.html').then(function(content) {
              if (self.isPost() === false) {
                self.assign({
                  chipArticleList: content
                });
                return self.display();
              } else {
                return self.success({
                  content: content
                });
              }
            });
          });
        } else {
          return self.redirect('/');
        }
      },
      showAction: function(aid) {
        var self;
        self = this;
        if (!isNaN(parseInt(aid))) {
          return D('article').where({
            id: parseInt(aid)
          }).find().then(function(data) {
            self.assign({
              module: 'index',
              item: data
            });
            if (self.isPost() === false) {
              return self.display();
            } else {
              return self.success({
                content: data['content']
              });
            }
          });
        } else {
          return self.redirect('/');
        }
      }
    };
  });

}).call(this);

//# sourceMappingURL=IndexController.js.map
