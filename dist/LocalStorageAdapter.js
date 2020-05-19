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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /* eslint-disable class-methods-use-this */

  /* eslint-disable func-names */

  /* eslint-disable no-plusplus */

  /* eslint-disable no-param-reassign */

  /* eslint-disable no-underscore-dangle */
  var LocalStorageJs = /*#__PURE__*/function () {
    function LocalStorageJs() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LocalStorageJs);

      if (!window.localStorage) throw new Error('No window.localStorage Defined');
      this.options = _objectSpread2({
        prefix: 'pre_'
      }, options);
      this.storage = window.localStorage;
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
        return this.options.prefix + key;
      }
    }, {
      key: "_get",
      value: function _get(key) {
        return JSON.parse(this.storage.getItem(this._prepareKey(key)));
      }
    }, {
      key: "get",
      value: function get(key) {
        var value = this._get(key);

        if (value) return value.value;
        return null;
      }
    }, {
      key: "set",
      value: function set(key, value) {
        if (!value) this.storage.removeItem(key);
        this.storage.setItem(this._prepareKey(key), JSON.stringify(this._prepareValue(value)));
        return value;
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var i = 0; i < this.storage.length; i++) {
          var key = this.storage.key(i);
          if (key.startsWith(this.options.prefix)) this.storage.removeItem(key);
        }
      }
      /**
       * Get cached value
       * @param {string} key key string
       * @param {integer} maxage in milliseconds
       * @param {function} callback function
       * @returns {object} value
       */

    }, {
      key: "tryGet",
      value: function tryGet(key, maxage, callback) {
        var self = this;
        if (!key) throw new Error('No Key Defined');
        if (!callback) throw new Error('No Callback Defined');
        if (!maxage) maxage = 10000;

        var value = this._get(key);

        var callbackResolver = function callbackResolver() {
          return self.set(key, callback());
        };

        if (!value) {
          return callbackResolver();
        }

        var milliOffset = Date.now() - new Date(value.stamp);

        if (maxage < milliOffset) {
          return callbackResolver();
        }

        return value.value;
      }
      /**
       * Get cached value Async
       * @param {string} key key string
       * @param {integer} maxage in milliseconds
       * @param {function/promise} callback function
       * @returns {object} Promise
       */

    }, {
      key: "tryGetAsync",
      value: function tryGetAsync(key, maxage, callback) {
        var self = this;
        if (!key) throw new Error('No Key Defined');
        if (!callback) throw new Error('No Callback Defined');
        if (!maxage) maxage = 10000;

        var storageValue = this._get(key);

        var callbackResolver = function callbackResolver() {
          var callbackResult;

          if (typeof callback === 'function') {
            callbackResult = callback();
          } else callbackResult = callback;

          if (callbackResult.toString() === '[object Promise]' || Object.prototype.hasOwnProperty.call(callbackResult, 'then')) {
            return new Promise(function (resolve, reject) {
              callbackResult.then(function (result) {
                return resolve(self.set(key, result));
              })["catch"](function (err) {
                return reject(err);
              });
            });
          }

          return new Promise(function (resolve) {
            resolve(self.set(key, callbackResult));
          });
        };

        if (!storageValue || !storageValue.value) {
          return callbackResolver();
        }

        var milliOffset = Date.now() - new Date(storageValue.stamp);

        if (maxage < milliOffset) {
          return callbackResolver();
        }

        return new Promise(function (resolve) {
          resolve(storageValue.value);
        });
      }
    }]);

    return LocalStorageJs;
  }();

  return LocalStorageJs;

}());
//# sourceMappingURL=LocalStorageAdapter.js.map
