define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            dataWaiter = require('global/dataWaiter'),
            $ = require('$'),
            orderType = $('#orderType').val();

        var loadMoreBtn = document.querySelector('.load-more');
        var isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click';


        G['goOrderDetail'] = function(orderId) {
            if (orderId) {
                window.location.replace(mobileDomain + "/" + orderType + "/order/detail/" + orderId);
            }
        };

        G['switchOrderCat'] = function(self, orderType) {
            self = $(self);
            if (orderType) {
                self.addClass('cur').siblings().removeClass('cur');
                dataWaiter.show();
                var orderList = G['orderList_' + orderType];
                if (!orderList) {
                    G['orderList_' + orderType] = {};
                }
                //无缓存,服务器拉取
                if (!orderList) {

                    $.ajax({
                        url: mobileDomain + '/canyin/orderlist/' + orderType + '/1_10.html',
                        success: function(data) {
                            dataWaiter.close();
                            if (data) {
                                if ($(data).hasClass('content-null-info')) {
                                    $('.load-more').hide();
                                } else {

                                    $('.load-more').show();
                                }
                                G['orderList_' + orderType] = data;
                                $('.order-list').html(data);
                            }
                        }
                    });

                } else { //有缓存,读缓存
                    dataWaiter.close();
                    if ($(orderList).hasClass('content-null-info')) {
                        $('.load-more').hide();
                    } else {

                        $('.load-more').show();
                    }
                    $('.order-list').html(orderList);
                }


            }
        };


        //页面加载
        var orderListTab = $('.order-list');
        if ($('.order-list').find('tbody').length) {
            orderListTab = $('.order-list').find('tbody');
        }
        //存入外卖订单缓存
        G['orderList_waimai'] = orderListTab.html();

        if (loadMoreBtn) {

            $('.load-more').on(click, function () {
                var $self = $(this);
                next = document.querySelector('.item-next'),
                url = next ? next.value : null;

                if (url) {
                    dataWaiter.show();
                    $.ajax({
                        url: url,
                        success: function (data) {
                            dataWaiter.close();
                            if (data) {
                                $('.item-next').remove();
                                 orderListTab = $('.order-list');
                                if ($('.order-list').find('tbody').length) {
                                    orderListTab = $('.order-list').find('tbody');
                                }
                                orderListTab.append(data);
                                if (!$(data).last().val()) {
                                    $(data).last().remove();
                                    $self.html('已加载全部订单').removeClass('load-more');
                                }
                            }
                        }
                    });
                }

            });
        }
    };
});