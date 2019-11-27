/**
 为什么用nextTick
  1）DOM 至少会在当前线程里面的代码全部执行完毕再更新。保证在 DOM 更新以后再执行某一块代码，就必须把这块代码放到下一次事件循环里面
  2）就像react的setState中第二个参数里面能拿到更新后的state数据类似，在nextTick中vue更新后的数据
  3) 之前vue2.5之前nextTick是优先宏任务实现的，现在是Promise.then实现的，效果都能取得更新后的数据
*/ 
// 1.Vue.nextTick
Vue.nextTick = nextTick;
// 2.this.$nextTick
Vue.prototype.$nextTick = function (fn) {
  return nextTick(fn, this)
};
// 3. 在Watcher对象中
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}