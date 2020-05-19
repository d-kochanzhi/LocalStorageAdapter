/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
export default class LocalStorageJs {
  constructor(options = {}) {
    if (!window.localStorage) throw new Error('No window.localStorage Defined');

    this.options = {
      prefix: 'pre_',
      ...options,
    };

    this.storage = window.localStorage;
  }

  _prepareValue(value) {
    return {
      stamp: Date.now(),
      value,
    };
  }

  _prepareKey(key) {
    return this.options.prefix + key;
  }

  _get(key) {
    return JSON.parse(this.storage.getItem(this._prepareKey(key)));
  }

  get(key) {
    const value = this._get(key);
    if (value) return value.value;
    return null;
  }

  set(key, value) {
    if (!value) this.storage.removeItem(key);

    this.storage.setItem(this._prepareKey(key), JSON.stringify(this._prepareValue(value)));
    return value;
  }

  clear() {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
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
  tryGet(key, maxage, callback) {
    const self = this;
    if (!key) throw new Error('No Key Defined');
    if (!callback) throw new Error('No Callback Defined');
    if (!maxage) maxage = 10000;

    const value = this._get(key);

    const callbackResolver = function callbackResolver() {
      return self.set(key, callback());
    };

    if (!value) {
      return callbackResolver();
    }
    const milliOffset = Date.now() - new Date(value.stamp);

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
  tryGetAsync(key, maxage, callback) {
    const self = this;
    if (!key) throw new Error('No Key Defined');
    if (!callback) throw new Error('No Callback Defined');
    if (!maxage) maxage = 10000;

    const storageValue = this._get(key);

    const callbackResolver = function callbackResolver() {
      let callbackResult;
      if (typeof callback === 'function') {
        callbackResult = callback();
      } else callbackResult = callback;

      if (
        callbackResult.toString() === '[object Promise]' ||
        Object.prototype.hasOwnProperty.call(callbackResult, 'then')
      ) {
        return new Promise(function (resolve, reject) {
          callbackResult
            .then((result) => resolve(self.set(key, result)))
            .catch((err) => reject(err));
        });
      }
      return new Promise(function (resolve) {
        resolve(self.set(key, callbackResult));
      });
    };

    if (!storageValue || !storageValue.value) {
      return callbackResolver();
    }
    const milliOffset = Date.now() - new Date(storageValue.stamp);

    if (maxage < milliOffset) {
      return callbackResolver();
    }
    return new Promise(function (resolve) {
      resolve(storageValue.value);
    });
  }
}
