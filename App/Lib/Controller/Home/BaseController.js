/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]}
 * @return {[type]}         [description]
 */
module.exports = Controller(function(){
    'use strict';
    return {
        init: function(http){
            var self = this;
            self.super("init", http);
            D('article_cat').query('select *,(select COUNT(0) from that_article where that_article_cat.cid=that_article.cat) as len from that_article_cat').then(function(data){
                self.assign({catList: data, thisCId:null});
                self.fetch('chips/index_cat_list.html').then(function(content){
                    self.catListContent = content;
                    self.assign({catListContent: content});
                });
            });
            //其他的通用逻辑
        },
        __before:function(action){
            this.assign({
                title : action,
                module : action,
                scriptActive: true
            });
        }
    }
});