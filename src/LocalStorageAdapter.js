export default class LocalStorageJs {
  constructor(prefix) {
    if (!window.localStorage) throw 'No window.localStorage Defined';

    if (prefix) this._prefix = prefix;
    else this._prefix = 'pre_';

    this._storage = window.localStorage;
  }

  _prepareValue(value) {
    return {
      stamp: Date.now(),
      value,
    };
  }

  _prepareKey(key) {
    return this._prefix + key;
  }

  _get(key) {
    return JSON.parse(this._storage.getItem(this._prepareKey(key)));
  }

  get(key) {
    const value = this._get(key);
    if (value) return value.value;
    return null;
  }

  set(key, value) {
    if (!value) this._storage.removeItem(key);

    this._storage.setItem(this._prepareKey(key), JSON.stringify(this._prepareValue(value)));
    return value;
  }

  clear() {
    for (let i = 0; i < this._storage.length; i++) {
      const key = this._storage.key(i);
      if (key.startsWith(this._prefix)) this._storage.removeItem(key);
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
    if (!key) throw 'No Key Defined';
    if (!callback) throw 'No Callback Defined';
    if (!maxage) maxage = 10000;

    const value = this._get(key);

    const callbackResolver = function () {
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
    if (!key) throw 'No Key Defined';
    if (!callback) throw 'No Callback Defined';
    if (!maxage) maxage = 10000;

    const storageValue = this._get(key);

    const callbackResolver = function () {
      let callbackResult;
      if (typeof callback === 'function') {
        callbackResult = callback();
      } else callbackResult = callback;

      if (
        callbackResult.toString() === '[object Promise]' ||
        callbackResult.__proto__.hasOwnProperty('then')
      ) {
        return new Promise(function (resolve, reject) {
          callbackResult
            .then((result) => resolve(self.set(key, result)))
            .catch((err) => reject(err));
        });
      }
      return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
      resolve(storageValue.value);
    });
  }
}
