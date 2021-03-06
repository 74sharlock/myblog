// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = Controller("Home/BaseController", function() {
    "use strict";
    return {
      indexAction: function() {
        var self;
        self = this;
        return D('article').query('select *,(select cat_name from that_article_cat where that_article.cat=that_article_cat.cid) as cat_name from that_article ORDER BY modifytime DESC').then(function(data) {
          return self.session('memberInfo').then(function(s) {
            if (!isEmpty(s)) {
              self.assign('user', {
                name: s.name,
                id: s.mid
              });
            } else {
              self.assign('user', {});
            }
            self.assign('list', data);
            return self.fetch('chips/articleList.html').then(function(content) {
              if (self.isPost() === false) {
                self.assign('chipArticleList', content);
                return self.display();
              } else {
                return self.success({
                  content: content
                });
              }
            });
          });
        });
      },
      letAddAction: function() {
        var self;
        self = this;
        return this.session('memberInfo').then(function(data) {
          if (data !== void 0 && data['mid'] === 0) {
            self.assign('author', data['name']);
            self.assign('scriptActive', false);
            return self.display();
          } else {
            return self.redirect('/wannerAdd');
          }
        });
      },
      wannerAddAction: function() {
        var self;
        self = this;
        return D('article_cat').query('select *,(select COUNT(0) from that_article where that_article_cat.cid=that_article.cat) as len from that_article_cat').then(function(data) {
          self.assign({
            catList: data
          });
          return self.fetch('chips/index_cat_list.html').then(function(content) {
            self.catListContent = content;
            self.assign({
              catListContent: content
            });
            self.assign({
              module: 'index'
            });
            return self.display();
          });
        });
      },
      checkAction: function() {
        var psw, self;
        psw = this.post('password').trim();
        self = this;
        return D('user').where({
          id: 1,
          password: md5(psw)
        }).find().then(function(data) {
          if (isEmpty(data)) {
            return self.error(403, '密码不对');
          } else {
            return self.session('memberInfo', {
              mid: 0,
              name: data['username']
            });
          }
        }).then(function() {
          return self.success();
        });
      },
      logOutAction: function() {
        var self;
        self = this;
        return this.session().then(function() {
          return self.redirect('/');
        });
      },
      addAction: function() {
        var postData, self, thisTime;
        postData = this.post();
        self = this;
        thisTime = now();
        postData['createtime'] = thisTime;
        postData['modifytime'] = thisTime;
        return D('article').add(postData).then(function(id) {
          console.log(id);
          return self.redirect('/');
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=IndexController.js.map
