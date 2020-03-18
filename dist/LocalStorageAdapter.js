var LocalStorageAdapter = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var LocalStorageJs = /*#__PURE__*/function () {
    function LocalStorageJs(prefix) {
      _classCallCheck(this, LocalStorageJs);

      if (!window.localStorage) throw "No window.localStorage Defined";
      if (prefix) this._prefix = prefix;else this._prefix = "pre_";
      this._storage = window.localStorage;
    }

    _createClass(LocalStorageJs, [{
      key: "_prepareValue",
      value: function _prepareValue(value) {
        return {
          stamp: Date.now(),
          value: value
        };
      }
    }, {
      key: "_prepareKey",
      value: function _prepareKey(key) {
        return this._prefix + key;
      }
    }, {
      key: "_get",
      value: function _get(key) {
        return JSON.parse(this._storage.getItem(this._prepareKey(key)));
      }
    }, {
      key: "get",
      value: function get(key) {
        var value = this._get(key);

        if (value) return value.value;else return null;
      }
    }, {
      key: "set",
      value: function set(key, value) {
        if (!value) this._storage.removeItem(key);

        this._storage.setItem(this._prepareKey(key), JSON.stringify(this._prepareValue(value)));

        return value;
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var i = 0; i < this._storage.length; i++) {
          var key = this._storage.key(i);

          if (key.startsWith(this._prefix)) this._storage.removeItem(key);
        }
      }
      /**
       * Get cached value
       * @param {string} key
       * @param {integer} maxage in milliseconds
       * @param {function} callback
       * @returns {object} value
       */

    }, {
      key: "tryGet",
      value: function tryGet(key, maxage, callback) {
        var self = this;
        if (!key) throw "No Key Defined";
        if (!callback) throw "No Callback Defined";
        if (!maxage) maxage = 10000;

        var value = this._get(key);

        var callbackResolver = function callbackResolver() {
          return self.set(key, callback());
        };

        if (!value) {
          return callbackResolver();
        } else {
          var milliOffset = Date.now() - new Date(value.stamp);

          if (maxage < milliOffset) {
            return callbackResolver();
          } else return value.value;
        }
      }
      /**
       * Get cached value Async
       * @param {string} key
       * @param {integer} maxage in milliseconds
       * @param {function/promise} callback
       * @returns {object} Promise
       */

    }, {
      key: "tryGetAsync",
      value: function tryGetAsync(key, maxage, callback) {
        var self = this;
        if (!key) throw "No Key Defined";
        if (!callback) throw "No Callback Defined";
        if (!maxage) maxage = 10000;

        var value = this._get(key);

        var callbackResolver = function callbackResolver() {
          var callbackResult;

          if (typeof callback === "function") {
            callbackResult = callback();
          } else callbackResult = callback;

          if (callbackResult.toString() === "[object Promise]" || callbackResult.__proto__.hasOwnProperty('then')) {
            return new Promise(function (resolve, reject) {
              callbackResult.then(function (result) {
                resolve(self.set(key, result));
              });
            });
          } else {
            return new Promise(function (resolve, reject) {
              resolve(self.set(key, callbackResult));
            });
          }
        };

        if (!value) {
          return callbackResolver();
        } else {
          var milliOffset = Date.now() - new Date(value.stamp);

          if (maxage < milliOffset) {
            return callbackResolver();
          } else return new Promise(function (resolve, reject) {
            resolve(value.value);
          });
        }
      }
    }]);

    return LocalStorageJs;
  }();

  return LocalStorageJs;

}());
//# sourceMappingURL=LocalStorageAdapter.js.map
