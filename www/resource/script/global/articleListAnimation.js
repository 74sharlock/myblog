// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(nodeScope, newChildrenContent) {
    var i, item, items, len, newChildrenAnimation, results;
    newChildrenAnimation = function() {
      var i, item, items, len, results;
      this.innerHTML = newChildrenContent;
      items = this.QA('li');
      results = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        results.push(TweenLite.from(item, 0.5, {
          x: -300,
          opacity: 0,
          ease: Back.easeOut.config(1.5),
          onComplete: function() {}
        }));
      }
      return results;
    };
    if (nodeScope) {
      items = nodeScope.QA('li');
      if (items.length) {
        results = [];
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          results.push(TweenLite.to(item, 0.5, {
            x: 300,
            opacity: 0,
            ease: Back.easeIn.config(1.5),
            onComplete: newChildrenAnimation.bind(nodeScope)
          }));
        }
        return results;
      } else {
        return newChildrenAnimation.call(nodeScope);
      }
    }
  };

}).call(this);

//# sourceMappingURL=articleListAnimation.js.map