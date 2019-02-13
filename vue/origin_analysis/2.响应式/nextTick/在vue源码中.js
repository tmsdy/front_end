/**
 为什么用nextTick
  因为 DOM 至少会在当前线程里面的代码全部执行完毕再更新。所以不可能做到在修改数据后并且 DOM 更新后再执行，
  要保证在 DOM 更新以后再执行某一块代码，就必须把这块代码放到下一次事件循环里面
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