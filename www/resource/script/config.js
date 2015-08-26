// Generated by CoffeeScript 1.9.3
(function() {
  R(function() {
    var G, action, actionContainer, item, len;
    $('.ui.dropdown').dropdown();
    if (CE('div').classList) {
      window.module = document.body.gas('data-module');
      if (window.module) {
        if (typeof window[window.module] === 'undefined') {
          window[window.module] = {};
        }
        G = window[window.module];
        G.actions = {};
        if (document.body.gas('data-active') === 'true') {
          actionContainer = document.querySelectorAll('[data-action]');
          len = actionContainer.length;
          while (len--) {
            item = actionContainer[len];
            action = item.getAttribute('data-action');
            if (action) {
              G.actions[action] = {};
              require('./module/' + window.module + '/' + action + '.js').call(G, item);
            }
          }
          return null;
        }
      }
    }
  });

}).call(this);

//# sourceMappingURL=config.js.map
