define(function (require, exprots, module) {
    module.exports = {
        'staticResource': '/resource/view/index.html',
        "praiseUrl": function (id) {
            return "/CMS/news/Praise?id=" + id;
        },
        // 评论接口地址
        "infoReviewUrl": "/CMS/InfoReview/Review",
        'forumAddUrl': function (id) {
            return 'bbs/' + id + '/add';
        },
        'forumListUrl': function (id, pageSize) {
            return 'bbs/' + id + '/1_' + (Object.prototype.toString.call(pageSize) === '[object Number]' ? pageSize : 10) + '.html';
        },
        'forumDetailUrl': function (id) {
            return 'bbs/detail-' + id + '.html';
        },
        //图片上传接口
        'imageUploadUrl': function (userType) {
            return '/cms/file/UploadImage?type=' + (userType ? userType : '');
        },
        //手机端用户上传图片
        'imageUploadByUserUrl': '/cms/file/UploadFileByUser',
        //微社区手机端话题添加
        'wsqTopicAdd': function (id) {
            return '/wsq/' + id + '/add';
        },
        'editor': '/resource/views/editor.html',
        'addTopicsPage': '/Admin/MicroCommunityAdmin/CreateTheme',
        //社区创建&&修改
        'MicroCommunityAdminModify': '/Admin/MicroCommunityAdmin/Create',
        //微社区详情
        'wsqDetailUrl': function (id) {
            return '/wsq/topic/' + id + "/1_10.html";
        },
        //表情静态视图
        'looksView': '/resource/views/microCommunity/addTopic.html',

        //话题添加接口
        'addTopics': '/Admin/MicroCommunityAdmin/AddTheme',

        //微社区评论接口
        "communityreplyUrl": "/Wap/MicroCommunity/AddReply",
        //微社区点赞接口
        'communityreplyPraise': '/Wap/MicroCommunity/PointPraise',

        //微社区删除评论接口
        'deleteReply': '/Admin/MicroCommunityAdmin/DeleteReply',

        //餐饮外卖进入购物车接口
        'toShopcart': mobileDomain + '/CanYin/WaiMai/WaiMaiRecipe/ShopCart',
        //餐饮外卖提交订单接口
        'submitOrder': mobileDomain + '/CanYin/WaiMai/WaiMaiOrder/ConfirmOrder',
        //餐饮外卖支付订单接口
        'payOrder': mobileDomain + '/CanYin/WaiMai/WaiMaiOrder/PayOrder',
        //餐饮初始化购物车
        'getCartItemsUrl': mobileDomain + '/CanYin/WaiMai/WaiMairecipe/ShopCartItem',
        //获取指定分类下的菜品
        'getDishesUrl': mobileDomain + '/CanYin/TangShi/TangShiMenu/Recipeindex'
    };
});