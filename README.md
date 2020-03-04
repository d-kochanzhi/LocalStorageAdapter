# JavaScript: localstorage with expire time value

### usage:
```js
  //new instance
var storage = new LocalStorageAdapter();

//set value
storage.set('key_no_cache', 'test');

//get value
storage.get('key_no_cache');

/*********************************
get value with cache
key = my key
time = milliseconds cache life time
callback = function
return = value
*/
callback = function () {
    return "hello from callback";
}
var data = storage.tryGet('key1', 5000, callback)
console.log(`[tryGet]key1 = {data}`);

/*********************************
get value with cache
key = my key
time = milliseconds cache life time
callback = function
return = promise 
*/
callback = function () {
    return "hello from callback";
}
storage.tryGetAsync('key2', 5000, callback)
    .then((data) => {
        console.log(`[tryGetAsync+callback]key2 = {data}`);
    });

/*********************************
get value with cache
key = my key
time = milliseconds cache life time
callback = function or promise
return = promise 
*/
var promise = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve("hello from promise");
    }, 1000);
});
storage.tryGetAsync('key3', 5000, promise)
    .then((data) => {
        console.log(`[tryGetAsync+promise]key3 = {data}`);
    });

/*********************************
promise inside function = to prevent execution
*/
var functionWithPromise = function () {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve("hello from functionWithPromise");
        }, 1000);
    });
};
storage.tryGetAsync('key4', 5000, functionWithPromise)
    .then((data) => {
        console.log(`[tryGetAsync+function+promise]key4 = {data}`);
    });
```


License
----

MIT


