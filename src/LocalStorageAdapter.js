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
   * @param {string} key 
   * @param {integer} maxage in milliseconds
   * @param {function/promise} callback 
   */
  tryGet(key, maxage, callback) {
    var self = this;
    if (!key) throw "No Key Defined";
    if (!callback) throw "No Callback Defined";
    if (!maxage) maxage = 10000;

    if (typeof (callback) === "function") {
      var value = this._get(key);
      if (!value) {
        return this.set(key, callback());
      } else {
        var milliOffset = Date.now() - new Date(value.stamp);
        if (maxage < milliOffset) {
          return this.set(key, callback());
        } else return value.value;
      }

    } else if (typeof (callback) === "object"
      && callback.toString() === "[object Promise]") {

      return new Promise((resolve, reject) => {

        var value = this._get(key);
        if (!value) {
          promise.then((result) => {
            resolve(self.set(key, result));
          });
        } else {
          var milliOffset = Date.now() - new Date(value.stamp);
          if (maxage < milliOffset) {
            promise.then((result) => {
              resolve(self.set(key, result));
            });
          }
          else resolve(value.value);
        }
      });

    }

  }
}
