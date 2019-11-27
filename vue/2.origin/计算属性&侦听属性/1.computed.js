// 一开始不会计算值，在访问computed的值时计算
function initState(vm) {
    //   ...
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}

function initComputed(vm, computed) {

    var watchers = vm._computedWatchers = Object.create(null);
    var isSSR = isServerRendering();

    for (var key in computed) { //userDef可以是函数或者对象，通常是函数
        var userDef = computed[key];
        var getter = typeof userDef === 'function' ? userDef : userDef.get;//拿到computed我们写的函数
        if (!isSSR) {
            //实例化会push到vm._watchers里面，这个watcher传入了我们写的函数，赋给watcher.getter
            watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
        }

        if (!(key in vm)) { //一般走这儿
            defineComputed(vm, key, userDef);
        } else {
            //   ...在data或props里已经有了，报警告
        }
    }
}
var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
function defineComputed(target, key, userDef) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache
            ? createComputedGetter(key)
            : userDef;
        sharedPropertyDefinition.set = noop;
    } else {
        // ...
    }
    //   ...
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) { //访问值走这儿，第一次的render时候会访问一次
    return function computedGetter() {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) { //如果需要计算就计算，不需要就直接返回之前的值
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend(); //渲染watcher订阅了computedWatcher的Dep,收集依赖的值应该
            }
            return watcher.value
        }
    }
}