/// <reference path="../../../../Areas/Admin/Views/MicroCommunityAdmin/ReplyLsit.cshtml" />
define(function (require, exports, module) {
    var d = require('plugin/dialog');
    return function () {
        var $ = require('$');
        //删除回复
        $('[data-delete]').on("click", function () {
            var id = $(this).attr("data-delete") || 0,
            href = $(this).attr("href");
            d({
                title: '确认提示',
                width: 180,
                content: '是否删除该条回复？',
                cancelValue: '取消',
                ok: function () {
                    var self = this;
                    self.remove();
                    $.post(href, { ids: id }, function (data) {
                        require('alert')(data['message'], 3000, true, true);
                        if (data.statusCode = "200") {
                            window.location.href = window.location.href;
                        }
                    });
                    return false;
                },
                okValue: '确认',
                cancel: function () {
                    var self = this;
                    self.remove();
                }
            }).showModal();
            event.preventDefault();
        });

        var replayTable = document.getElementById('replayTable');
        if(replayTable){
            replayTable.addEventListener('click',function(e){
                e = e || window.event;
                var target = e.target || e.srcElement;
                if(target.nodeName === 'A'){
                    var act = target.getAttribute('data-act');
                    if(act){
                        switch (act){
                            case 'check':
                                var next = target.parentNode.parentNode.nextSibling,
                                    ul = next.nodeType === 3 ? next.nextSibling : next,
                                    isUp = target.innerText === '查看回复';
                                if(ul){
                                    ul.classList.toggle('active');
                                }
                                if(isUp){
                                    target.innerHTML = '收起回复';
                                } else {
                                    target.innerHTML = '查看回复';
                                }
                                break;
                            case 'del':
                                d({
                                    title: '确认提示',
                                    width: 180,
                                    content: '真的不想再看到这条回复吗?',
                                    cancelValue: '等一下!',
                                    ok: function () {
                                        var self = this,
                                            id = target.getAttribute('data-id'),
                                            pid = target.getAttribute('data-pid'),
                                            waiter = require('global/dataWaiter');
                                        if(id){
                                            waiter.show();
                                            var xhr = new XMLHttpRequest();
                                            xhr.onload = function(){
                                                var data = xhr.responseText;
                                                if(Object.prototype.toString.call(data)){
                                                    data = JSON.parse(data);
                                                }
                                                self.close();
                                                waiter.close();
                                                require('alert')(data['message'], 3000, true, true);
                                                if(data['statusCode'] == '200'){
                                                    var p = target.parentNode.parentNode, ul = p.parentNode;
                                                    ul.removeChild(p);
                                                    if (!$(ul).find("li").length) $('[data-replayid="' + pid + '"]').remove();
                                                }
                                            };
                                            xhr.open('post',require('api')['deleteReply'],true);
                                            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                                            xhr.send("ids="+id+"&pid=" + pid + "");
                                        }
                                        return false;
                                    },
                                    okValue: '没错',
                                    cancel: function () {
                                        var self = this;
                                        self.remove();
                                    }
                                }).showModal();
                                break;
                        }
                    }
                }
            },false);
        }
        //checked取消后 取消全选
        $("#replayTable").find('[name="ids"]').change(function () {
            var checks = $("#replayTable").find('[name="ids"]');
            var checked = $("#replayTable").find('[name="ids"]:checked');
            if (checks.length > checked.length)
                $("#groupCheck").attr("checked", false).prop('checked', false).attr("data-isall", "none");
            else
                $("#groupCheck").attr("checked", true).prop('checked', true).attr("data-isall", "all");
        });

        //全选or反选
        $("#groupCheck").on("click", function () {
            var $this = $(this);
            var isall = $this.attr("data-isall") || "none";
            $checkboxLi = $("#replayTable").find(":checkbox[name='ids']");
            if (isall == "all") {
                $checkboxLi.attr("checked", false).prop('checked', false);
                $this.attr("data-isall", "none");
            }
            else if (isall == "none") {
                $checkboxLi.attr("checked", true).prop('checked', true);
                $this.attr("data-isall", "all");
            }
        });

        //批量删除回调
        $("#delAll").on("click", function () {
            var $this = $(this);
            function _getIds($panel) {
                var ids = "";
                $panel.find("input:checked").filter("[name='ids']").each(function (i) {
                    var val = $(this).val();
                    ids += i == 0 ? val : "," + val;
                });
                return ids;
            }
            var ids = _getIds($("#replayTable"));
            if (!ids) {
                require('alert')("请选择要删除的内容", 3000, true, true);
                return false;
            }
            d({
                title: '确认提示',
                width: 180,
                content: '<div class="text-center">确定继续删除？</div>',
                cancelValue: '取消',
                ok: function () {
                    var getdata = function () {
                        if (ids.indexOf(',') > 0) {
                            return $.map(ids.split(','), function (val, i) {
                                return { name: "ids", value: val };
                            })
                        } else {
                            var _data = {};
                            _data["ids"] = ids;
                            return _data;
                        }
                    }();
                    $.ajax({
                        type: 'POST',
                        url: require('api')['deleteReply'],
                        dataType: 'json',
                        cache: false,
                        data: getdata,
                        success: function (data) {
                            require('alert')(data['message'], 3000, true, true);
                            if (data.statusCode = "200") {
                                window.location.href = window.location.href;
                            }
                        }
                    });
                    return false;
                },
                okValue: '确认',
                cancel: function () {
                    var self = this;
                    self.remove();
                }
            }).showModal();
        });
    }
});