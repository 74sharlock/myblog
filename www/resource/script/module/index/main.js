// Generated by CoffeeScript 1.9.3
(function() {
  define(function(require, exports, module) {
    var G, action, actionContainer, item, len, source;
    G = window[window.module];
    G.actions = {};
    actionContainer = document.querySelectorAll('[data-action]');
    len = actionContainer.length;
    while (len--) {
      item = actionContainer[len];
      action = item.getAttribute('data-action');
      if (action) {
        G.actions[action] = {};
        source = 'module/' + window.module + '/' + action + 'Action.js';
        require.async(source, function(fn) {
          if (fn) {
            return fn();
          }
        });
      }
    }
    return null;
  });

}).call(this);

//# sourceMappingURL=main.js.map
