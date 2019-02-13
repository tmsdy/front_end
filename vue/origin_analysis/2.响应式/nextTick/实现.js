var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
var microTimerFunc; //微任务实现
var macroTimerFunc; //宏任务实现 都是根据浏览器的支持程度作不同的处理
var useMacroTask = false; //默认用微任务实现

if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) { 
  //判断浏览器原生支不支持setImmediate，支持就用setImmediate实现宏任务(IE才支持)
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) { //否则MessageChannel实现宏任务(一般走这儿，Web Workers 的内部实现就是用到了 MessageChannel)
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  macroTimerFunc = function () { //否则setTimeout实现宏任务
    setTimeout(flushCallbacks, 0);
  };
}
// 支持Promise就用Promise实现微任务，否则直接指向宏任务
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve(); 
  microTimerFunc = function () {
    p.then(flushCallbacks);
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () { //把要执行的函数收集到callbacks数组中，在nextTick全部执行
    if (cb) {
      try { //try,catch保证就算某个cb报错后面逻辑也能执行
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}