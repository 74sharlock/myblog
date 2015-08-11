// Generated by CoffeeScript 1.9.2
(function() {
  var DataWater, toString;

  window.Q = document.querySelector.bind(document);

  window.D = document.getElementById.bind(document);

  window.QA = document.querySelectorAll.bind(document);

  window.CE = document.createElement.bind(document);

  toString = Object.prototype.toString;

  window.getType = function(everything) {
    return toString.call(everything).replace('[object ', '').replace(']', '').toLowerCase();
  };

  window.isFuction = function(fn) {
    return getType(fn) === 'function';
  };

  window.isArray = function(arr) {
    return getType(arr) === 'array';
  };

  window.isString = function(string) {
    return getType(string) === 'string';
  };

  window.isBoolean = function(boolean) {
    return getType(boolean) === 'boolean';
  };

  Element.prototype.on = function(event, callback, capte) {
    return this.addEventListener(event, callback, isBoolean(capte) ? capte : false);
  };

  Element.prototype.off = function(event, callback, capte) {
    return this.removeEventListener(event, callback, isBoolean(capte) ? capte : false);
  };

  Element.prototype.gas = Element.prototype.getAttribute;

  Element.prototype.Q = function(selector) {
    return this.querySelector(selector);
  };

  Element.prototype.QA = function(selector) {
    return this.querySelectorAll(selector);
  };

  Element.prototype.removeClass = function(className) {
    this.classList.remove(className);
    return this;
  };

  Element.prototype.addClass = function(className) {
    this.classList.add(className);
    return this;
  };

  Element.prototype.toggleClass = function(className) {
    this.classList.toggle(className);
    return this;
  };

  Element.prototype.hasClass = function(selector) {
    return this.classList.contains(selector);
  };

  Element.prototype.index = function() {
    var i, item, j, len, nodeName, ref;
    nodeName = this.nodeName.toLowerCase();
    ref = this.parentNode.querySelectorAll(nodeName);
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      item = ref[i];
      if (this === item) {
        return i;
      }
    }
  };

  Element.prototype.data = function(name) {
    return this.gas('data-' + name);
  };

  Element.prototype.animation = function(opts) {
    var count, delay, direction, duration, h;
    h = function() {
      this.removeClass('animated');
      this.removeClass(opts.name);
      this.isAnimating = false;
      if (isFuction(opts.fn)) {
        opts.fn.call(this);
      }
      this.off('webkitAnimationEnd', h, false);
      return this.off('animationend', h, false);
    };
    this.on('webkitAnimationEnd', h, false);
    this.on('animationend', h, false);
    if (getType(opts.name) === 'string') {
      duration = opts.duration || 1;
      delay = getType(opts.delay) === 'number' ? opts.delay : 0;
      count = opts.count || 1;
      direction = opts.direction;
      if (!(getType(this.isAnimating) === 'boolean')) {
        this.isAnimating = false;
      }
      if (!this.isAnimating) {
        this.isAnimating = true;
        if (duration) {
          duration = duration + 's';
          this.style.animationDuration = duration;
          this.style.webkitAnimationDuration = duration;
        }
        if (delay) {
          delay = delay + 's';
          this.style.animationDelay = delay;
          this.style.webkitAnimationDelay = delay;
        }
        if (direction) {
          this.style.animationDirection = direction;
          this.style.webkitAnimationDirection = direction;
        }
        if (!(parseInt(count, 10) === 1)) {
          this.style.animationIterationCount = count;
          this.style.webkitAnimationIterationCount = count;
        }
        this.addClass('animated');
        return this.addClass(opts.name);
      }
    }
  };

  NodeList.prototype.on = function(event, calback, capte) {
    var elem, j, len;
    for (j = 0, len = this.length; j < len; j++) {
      elem = this[j];
      elem.on(event, calback, isBoolean(capte) ? capte : false);
    }
    return this;
  };

  window.queryData = function(url, data, method, callback, needJson) {
    var dataString, key, val, xhr;
    dataString = '';
    if (toString.call(method) === '[object Function]') {
      needJson = isBoolean(callback) ? callback : true;
      callback = method;
      method = 'post';
    }
    xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (toString.call(callback) === '[object Function]') {
        return callback((isString(xhr.responseText) && needJson === true ? JSON.parse(xhr.responseText) : xhr.responseText));
      }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    for (key in data) {
      val = data[key];
      dataString += String(key) + '=' + String(val) + '&';
    }
    return xhr.send(dataString);
  };

  window.isPhone = (function() {
    var agents, flag, l, userAgent;
    userAgent = navigator.userAgent;
    agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    flag = false;
    l = agents.length;
    while (l--) {
      if (userAgent.indexOf(agents[l]) > 0) {
        flag = true;
        break;
      }
    }
    return flag;
  })();

  window.click = isPhone ? 'touchend' : 'click';

  DataWater = (function() {
    function DataWater() {
      this.node = Q('.data-waiter') || this.createDom();
    }

    DataWater.prototype.createDom = function() {
      var d;
      d = CE('div');
      d.className = "data-waiter hidden";
      d.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
      document.body.appendChild(d);
      return d;
    };

    DataWater.prototype.show = function() {
      var self;
      if (!Q('.data-waiter')) {
        this.node = this.createDom();
      }
      this.node.removeClass('hidden');
      self = this;
      setTimeout(function() {
        return self.node.addClass('waiting');
      }, 0);
      return this;
    };

    DataWater.prototype.close = function() {
      var h;
      h = function(e) {
        var target;
        target = e.target;
        target.addClass('hidden');
        target.off('transitionend', h, false);
        return target.off('webkitTransitionEnd', h, false);
      };
      if (this.node) {
        this.node.removeClass('waiting');
        this.node.on('transitionend', h, false);
        this.node.on('webkitTransitionEnd', h, false);
      }
      return this;
    };

    DataWater.prototype.remove = function() {
      var self;
      self = this;
      if (self.node) {
        document.body.removeChild(self.node);
      }
      return self;
    };

    return DataWater;

  })();

}).call(this);

//# sourceMappingURL=lib.js.map
