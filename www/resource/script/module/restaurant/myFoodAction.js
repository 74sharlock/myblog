define(function (require, exports, module) {
    return function () {
        var api = require('api'),
            dataWaiter = require('global/dataWaiter'),
            Alert = require('global/alert.js'),
            $ = require('$');

        var loadMoreBtn = document.querySelector('.load-more');
        var isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click';

        //注册tr点击事件
        var regOrderItem = function () {
            $('.orderitem').on( 'click', function () {
                var $self = $(this),
                id = $self.data('id');
                if (id) {
                    window.location.replace(mobileDomain+"/waimai/order/detail/" + id);
                }

            });
        }

        $(function() {
                regOrderItem();
            }
        );

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
                                $('.order-list').find('tbody').append(data);
                                regOrderItem();
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