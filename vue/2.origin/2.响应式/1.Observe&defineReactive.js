
function observe(value, asRootData) {
    // 不能是非对象类型或者VNode
    if (!isObject(value) || value instanceof VNode) return
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__ // 做过响应处理的一种缓存，不用再处理了
    } else if ( // 第一次做响应处理的
        shouldObserve &&
        !isServerRendering() &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) { //满足上面各种条件才能实例化Observer
        ob = new Observer(value);
    }
    // ...
    return ob
}

var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this); //给value添加__ob__属性并指向当前实例
    if (Array.isArray(value)) {
        // ...
        for (var i = 0, l = value.length; i < l; i++) { //是数组递归调observe
            observe(value[i]);
        }
    } else {
        this.walk(value); //是对象遍历属性调defineReactive（核心）
    }
};

function def(obj, key, val, enumerable) { //封装defineProperty
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i]);
    }
};

function defineReactive(obj, key, val, customSetter, shallow) {
    var dep = new Dep();
    //   ...
    var childOb = !shallow && observe(val); //子对象也变成响应式
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() { // 实例化过程中，会对模板中的属性进行求值，触发依赖收集
            var value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();//收集当前的渲染Watcher：Dep.target
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val;
            //   ...(如果值没变的啥都不做)
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            childOb = !shallow && observe(newVal); //把新值变为响应式
            dep.notify();//派发更新
        }
    });
}
