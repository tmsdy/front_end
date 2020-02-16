/**
 * slice() reference.
 */

var slice = Array.prototype.slice; // slice 的引用

module.exports = co['default'] = co.co = co; // 暴露 co

// 如上所述，这个函数用来将一个 generator 函数包装成一个返回 promise 的函数
co.wrap = function (fn) {
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    return co.call(this, fn.apply(this, arguments));
  }
};

function co(gen) { // 核心
  var ctx = this;
  // 保存传入的参数以支持 co(gen, arg1, arg2) 这样的调用
  var args = slice.call(arguments, 1);  

  return new Promise(function(resolve, reject) {
    // 判断传入参数的类型，如果是 function 则调用
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    // 如果不是 function 或者不是 generator 则直接 resolve 掉
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    // 如果是 generator，获取它的每个 yield 值
    onFulfilled();

    // 封装了一下 .next() 以捕捉错误并反复调用后面定义的 next 函数
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
      return null;
    }

    // promise 出错后执行这个
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    // 获取 .next() 值并返回 promise
    // co 的精髓就在于此，它会反复调用这个方法实现 generator 的自动执行
    function next(ret) {
      // 如果已经迭代完了就 resolve 最终值
      if (ret.done) return resolve(ret.value);
      // 否则把值转换为 promise
      var value = toPromise.call(ctx, ret.value);
      // 如果是 promise 则再次执行 onFulfilled
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      // 否则报错
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}

// 将 yield 值转换为 promise，考虑到了多种情况
function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}
// 将 thunk 函数转换为 promise
function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

// 将数组中的 yield 值转换为 promise
function arrayToPromise(obj) {
  // 这里要用 Promise.all 等待所有值 resolve
  // 一个常见的错误是直接用 map 去 resolve 每一个 promise
  return Promise.all(obj.map(toPromise, this));
}

// 将包含 yield 值的对象转换为 promise
function objectToPromise(obj){
  // 新建一个空对象
  var results = new obj.constructor();
  // 获取传入参数的键值
  var keys = Object.keys(obj);
  var promises = [];
  // 遍历对象
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    // 尝试把每一项都转成 promise
    var promise = toPromise.call(this, obj[key]);
    // 如果是 promise，执行 defer
    if (promise && isPromise(promise)) defer(promise, key);
    // 否则直接保存到 result 中
    else results[key] = obj[key];  
  }
  return Promise.all(promises).then(function () {
    // 最后等所有 promise 都 resolve 了返回 result
    return results;  
  });

  // 这个函数用来将 promise resolve 掉并且保存到 result 对象中
  function defer(promise, key) {
    // 预定义 key 对应的值为 undefined
    results[key] = undefined;
    // 把 promise 的返回值保存到 promises 里
    promises.push(promise.then(function (res) {
      // 并且把返回值和 key 值记录到 result 中
      results[key] = res;  
    }));
  }
}

// 判断一个对象是否为 promise
function isPromise(obj) {
  return 'function' == typeof obj.then;
}

// 判断一个对象是否为 generator
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

// 判断一个对象是否为 generator function
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

// 判断一个值是否为对象
function isObject(val) {
  return Object == val.constructor;
}