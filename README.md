# JavaScript: localstorage with expire time value

### usage:
```js
 //new instance
var storage = new LocalStorageAdapter();

//set value
storage.set('key_no_cache', 'test');

//get value
storage.get('key_no_cache');

/*
get value with cache
key = my key
maxage = 1000 milliseconds cache life time
callback = function/Promise
*/
callback = function () {
    return "hello from callback";
}
var data = storage.tryGet('with_cache_callback', 3000, callback)
console.log(data);

var promise = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve("hello from promise");
    }, 1000);
});
storage.tryGet('with_cache_promise', 3000, promise)
    .then((data) => {
        console.log(data);
    });
```


License
----

MIT


