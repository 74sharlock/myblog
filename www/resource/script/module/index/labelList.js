// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(nodeScope) {
    var eve, event, h, handler, j, len, line, lis, results, ul;
    ul = nodeScope.Q('ul');
    lis = ul.QA('li');
    line = nodeScope.Q('.line');
    h = parseInt(getComputedStyle(line)['height']);
    handler = function(e) {
      var curIndex, curLi, i, index, item, j, k, len, len1, li, target, thisLi, type;
      target = e.target;
      type = e.type;
      curLi = ul.Q('.active');
      curIndex = curLi ? curLi.index() || 0 : void 0;
      for (j = 0, len = lis.length; j < len; j++) {
        item = lis[j];
        if (item.contains(target) || item === target) {
          thisLi = item;
        }
      }
      if (thisLi) {
        index = thisLi.index();
        if (type === 'click' || type === 'touchend') {
          e.preventDefault();
          for (k = 0, len1 = lis.length; k < len1; k++) {
            li = lis[k];
            li.removeClass('active');
          }
          thisLi.addClass('active');
          return line.removeClass('hidden').style.top = (index * h) + 'px';
        } else {
          if (!line.hasClass('hidden')) {
            if (type === 'mouseover') {
              i = index;
            } else if (type === 'mouseout') {
              i = curIndex;
            }
            return TweenLite.to(line, 0.35, {
              top: (i * h) + 'px',
              ease: Bounce.easeOut
            });
          }
        }
      }
    };
    event = ['mouseover', click, 'mouseout'];
    results = [];
    for (j = 0, len = event.length; j < len; j++) {
      eve = event[j];
      results.push(ul.on(eve, handler));
    }
    return results;
  };

}).call(this);

//# sourceMappingURL=labelList.js.map
