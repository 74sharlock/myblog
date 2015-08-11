define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            objectConcat = require('global/objectConcat'),
            $ = require('$'),
            api = require('api'),
            storage = window.localStorage, 
            D = require('plugin/m_dialog.js'),
            dataWaiter = require('global/dataWaiter');
        require('animationStep');

        //加入堂食点菜单
        G['addToMenu'] = function (menuData,tableId) {
            //获取该菜单的菜品
            if (!menuData || JSON.stringify(menuData) === '{}') {
                D.alert("<div class='text-center'>菜单异常，亲检查下！^_^</div>");
                return false;
            }

            D({
                title: '提示',
                content: '<div class="text-center">确定合并到堂食点菜单！</div>',
                ok: function () {
                    //保存菜单成功  跳转//tangshi/menu/detail/{menuId}
                    try {
                        D.close();
                        var oldmenuData = storage.getItem('menuData') ? JSON.parse(storage.getItem('menuData')) : {}; // 已选择的菜单车存储对象
                        //合并菜单车到点餐车
                         var thedata = objectConcat(oldmenuData, menuData);
                         if (thedata) {//合并成功
                             window.localStorage.removeItem('menuData');
                             storage.setItem('selectMenuData', JSON.stringify(thedata));
                        } else {//合并失败
                             storage.setItem('selectMenuData', JSON.stringify(menuData));
                        }

                        D.tips("<div class='text-center'>合并成功，跳转至堂食点菜中.....^_^</div>");
                        //todo wq 跳转到堂食首页-堂食点餐
                        setTimeout(function () {
                            window.location.href = mobileDomain + "/tangshi/0/2?tableId=" + tableId;
                        }, 1000);
                    } catch (e) {
                        window.location.reload();
                    }
                },
                okValue: '加入',
                cancelValue: '再看看'
            }).show();


            return true;
        };

        //加入外卖点餐车
        G['addToCart'] = function (menuData) {
            //获取该菜单的菜品
            if (!menuData || JSON.stringify(menuData) === '{}') {
                D.alert("<div class='text-center'>菜单异常，亲检查下！^_^</div>");
                return false;
            }

            D({
                title: '提示',
                content: '<div class="text-center">将此菜单加入点餐车！</div>',
                ok: function () {
                    //保存菜单成功  跳转//tangshi/menu/detail/{menuId}
                    try {
                        D.close();
                        var foodData = storage.getItem('foodData') ? JSON.parse(storage.getItem('foodData')) : {};
                        //合并菜单车到点餐车
                        var data = objectConcat(foodData, menuData);
                        if (data) {
                            storage.setItem('foodData', JSON.stringify(data));
                        } else {
                            storage.setItem('foodData', JSON.stringify(menuData));
                        }

                        D.tips("<div class='text-center'>添加成功，跳转至点餐车中.....^_^</div>");
                        //todo; 添加到购物车成功 跳转
                        var cartString = escape(JSON.stringify(menuData));
                        setTimeout(function () {
                            window.location.href = api.toShopcart + "?cartString=" + cartString;
                        }, 1500);
                    } catch (e) {
                        window.location.reload();
                    }
                },
                okValue: '加入',
                cancelValue: '再看看'
            }).show();


            return true;
        };

        //删除菜单
        G['deleteMenu'] = function (menuId) {

            if (!menuId) {
                D.tips("<div class='text-center'>菜单异常，亲检查下！^_^</div>", 2000);
                return;
            }
            D.confirm("<div class='text-center'>亲要删除该菜单么？</div>", function (self) {
                dataWaiter.show();
                $.ajax({
                    url:mobileDomain+ '/CanYin/TangShi/TangShiMenu/DeleteMenu',
                    data: { "menuId": menuId },
                    success: function (data) {
                        if (data) {
                            dataWaiter.close();

                            if (data.delId > 0) {
                                //删除菜单成功
                                D.close();
                                D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                                //todo; 删除成功 跳转
                                setTimeout(function () {
                                    window.location.href =mobileDomain+ "/waimai/menulist/1_10.html";
                                }, 1500);

                            } else {
                                D.close();
                                D.tips("<div class='text-center'>" + data.Message + "</div>", 2000);
                                return;
                            }
                        }
                    }
                });
            });

            event.preventDefault();

        };

    };
});