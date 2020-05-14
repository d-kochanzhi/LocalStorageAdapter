export default class LocalStorageJs {
    constructor(prefix) {
        if (!window.localStorage) throw "No window.localStorage Defined";

        if (prefix) this._prefix = prefix;
        else this._prefix = "pre_";

        this._storage = window.localStorage;
    }

    _prepareValue(value) {
        return { stamp: Date.now(), value: value };
    }

    _prepareKey(key) {
        return this._prefix + key;
    }

    _get(key) {
        return JSON.parse(this._storage.getItem(this._prepareKey(key)));
    }

    get(key) {
        var value = this._get(key);
        if (value) return value.value;
        else return null;
    }

    set(key, value) {
        if (!value) this._storage.removeItem(key);

        this._storage.setItem(
            this._prepareKey(key),
            JSON.stringify(this._prepareValue(value))
        );
        return value;
    }

    clear() {
        for (let i = 0; i < this._storage.length; i++) {
            let key = this._storage.key(i);
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
        var self = this;
        if (!key) throw "No Key Defined";
        if (!callback) throw "No Callback Defined";
        if (!maxage) maxage = 10000;

        var value = this._get(key);

        var callbackResolver = function () {
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
     * @param {string} key key string
     * @param {integer} maxage in milliseconds
     * @param {function/promise} callback function
     * @returns {object} Promise
     */
    tryGetAsync(key, maxage, callback) {
        var self = this;
        if (!key) throw "No Key Defined";
        if (!callback) throw "No Callback Defined";
        if (!maxage) maxage = 10000;

        var storageValue = this._get(key);

        var callbackResolver = function () {
            var callbackResult;
            if (typeof callback === "function") {
                callbackResult = callback();
            } else callbackResult = callback;

            if (callbackResult.toString() === "[object Promise]"
                || callbackResult.__proto__.hasOwnProperty('then')) {
                return new Promise(function (resolve, reject) {
                    callbackResult
                        .then(result => resolve(self.set(key, result)))
                        .catch(err => reject(err));
                });
            } else {
                return new Promise(function (resolve, reject) {
                    resolve(self.set(key, callbackResult));
                });
            }
        };

        if (!storageValue || !storageValue.value) {
            return callbackResolver();
        } else {
            var milliOffset = Date.now() - new Date(storageValue.stamp);

            if (maxage < milliOffset) {
                return callbackResolver();
            } else
                return new Promise(function (resolve, reject) {
                    resolve(storageValue.value);
                });
        }
    }
}
