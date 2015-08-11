define(function (require, exports, module) {
    return function () {
        var G = window[window.module],
            dataWaiter = require('global/dataWaiter'),
            $ = require('$'),
        tableId = parseInt($('#sel-table').val())||0;
        var loadMoreBtn = document.querySelector('.load-more');
        var isPhone = require('global/isPhone')(),
            click = isPhone ? 'touchend' : 'click';


        G['goMenuDetail'] = function (menuId) {
            if (menuId) {
                window.location.replace(mobileDomain + "/tangshi/menu/detail/" + menuId+"?tid="+tableId);
            }
        }



        if (loadMoreBtn) {

            $('.load-more').on(click, function () {
                var $self = $(this),
                next = document.querySelector('.item-next'),
                url = next ? next.value : null;

                if (url) {
                    dataWaiter.show();
                    $.ajax({
                        url: url,
                        success: function (data) {
                            dataWaiter.close();
                            if (data) {
                                if ($(data).hasClass('content-null-info')) {
                                    $('.load-more').hide();
                                } else {
                                    $('.load-more').show();

                                    $('.item-next').remove();
                                    $('.order-list').find('tbody').append(data);
                                    if (!$(data).last().val()) {
                                        $(data).last().remove();
                                        $self.html('已加载全部订单').removeClass('load-more');
                                    }
                                }
                            }
                        }
                    });
                }

            });
        }
    };
});