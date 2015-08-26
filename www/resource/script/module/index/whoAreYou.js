// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(nodeScope) {
    var btn, isSubmitting;
    isSubmitting = false;
    btn = D('btn');
    if (btn) {
      return btn.on(click, function() {
        var self;
        self = this;
        if (!isSubmitting) {
          isSubmitting = true;
          self.addClass('disabled');
          return queryData('/Home/Index/check', {
            password: D('psw').value.trim()
          }, function(data) {
            isSubmitting = false;
            self.removeClass('disabled');
            if (data['errno'] === 0) {
              return window.location.href = '/letAdd';
            } else {
              return alert(data['errmsg']);
            }
          });
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=whoAreYou.js.map
