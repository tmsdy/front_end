var Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    if (isRenderWatcher) {
        vm._watcher = this;
    }
    vm._watchers.push(this); //新建的Watcher会被push进vm._watchers里面
    if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
        this.lazy = !!options.lazy;
        this.sync = !!options.sync;
        this.before = options.before;
    } else {
        this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$1;
    this.active = true;
    this.dirty = this.lazy; //为计算属性服务
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    if (typeof expOrFn === 'function') { //一般走这里 把updateComponent方法赋值给this.getter
        this.getter = expOrFn;
    } else {
        this.getter = parsePath(expOrFn);
        // ...
    }
    this.value = this.lazy
        ? undefined //computed Watcher不求值
        : this.get(); //渲染Watcher走这儿计算值并更新页面的
};

Watcher.prototype.get = function get() {
    pushTarget(this); //把当前的渲染Watcher赋值给Dep.target
    var value;
    var vm = this.vm;
    value = this.getter.call(vm, vm); //调用getter方法，其实就是调用updateComponent方法
    //   ...
    if (this.deep) {
        traverse(value);
    }
    popTarget();
    this.cleanupDeps(); //渲染完成更新一波订阅者

    return value
};

Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
            dep.addSub(this); // 
        }
    }
};
Watcher.prototype.cleanupDeps = function cleanupDeps() {
    var this$1 = this;
    var i = this.deps.length;
    while (i--) {
        var dep = this$1.deps[i];
        if (!this$1.newDepIds.has(dep.id)) { //新旧比对，可能新一轮的订阅比之前少，去掉多余的订阅
            dep.removeSub(this$1);
        }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
};
Watcher.prototype.update = function update() {
    if (this.lazy) { //针对计算属性的
        this.dirty = true;
    } else if (this.sync) { //同步Watcher
        this.run();
    } else {
        queueWatcher(this); //一般走这里
    }
};

function queueWatcher(watcher) { //把需要更新的订阅者向一个队列里推
    var id = watcher.id;
    if (has[id] == null) { //判断watcher有无重复添加
        has[id] = true;
        if (!flushing) {
            queue.push(watcher); //push到队列
        } else {
            var i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }
        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue); //下个tick执行flushSchedulerQueue
        }
    }
}

function flushSchedulerQueue() {
    flushing = true;
    var watcher, id;
    queue.sort(function (a, b) { return a.id - b.id; });

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run(); //实现更新
        // ...有无限循环更新则报错
    }
    //   ...
    callHook(vm, 'updated'); //执行updated钩子
}

Watcher.prototype.run = function run() {
    if (this.active) {
        var value = this.get(); //调Watcher.get去求值,触发更新
        // ...
        this.value = value;
        // ...
    }
}
