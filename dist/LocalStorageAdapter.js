var LocalStorageAdapter = (function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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
    }, {
      key: "tryGet",
      value: function tryGet(key, maxage, callback) {
        var _this = this;

        var self = this;
        if (!key) throw "No Key Defined";
        if (!callback) throw "No Callback Defined";
        if (!maxage) maxage = 10000;

        if (typeof callback === "function") {
          var value = this._get(key);

          if (!value) {
            return this.set(key, callback());
          } else {
            var milliOffset = Date.now() - new Date(value.stamp);

            if (maxage < milliOffset) {
              return this.set(key, callback());
            } else return value.value;
          }
        } else if (_typeof(callback) === "object" && callback.toString() === "[object Promise]") {
          return new Promise(function (resolve, reject) {
            var value = _this._get(key);

            if (!value) {
              promise.then(function (result) {
                resolve(self.set(key, result));
              });
            } else {
              var milliOffset = Date.now() - new Date(value.stamp);

              if (maxage < milliOffset) {
                promise.then(function (result) {
                  resolve(self.set(key, result));
                });
              } else resolve(value.value);
            }
          });
        }
      }
    }]);

    return LocalStorageJs;
  }();

  return LocalStorageJs;

}());
//# sourceMappingURL=LocalStorageAdapter.js.map
