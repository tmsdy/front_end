// 3307行 -> 3355行

function initState(vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
        initData(vm);
    } else {
        observe(vm._data = {}, true /* asRootData */ );
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}

function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
        toggleObserving(false);
    }
    var loop = function (key) {
        keys.push(key);
        var value = validateProp(key, propsOptions, propsData, vm);
        /* istanbul ignore else */
        {
            var hyphenatedKey = hyphenate(key);
            if (isReservedAttribute(hyphenatedKey) ||
                config.isReservedAttr(hyphenatedKey)) {
                warn(
                    ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
                    vm
                );
            }
            defineReactive(props, key, value, function () {
                if (vm.$parent && !isUpdatingChildComponent) {
                    warn(
                        "Avoid mutating a prop directly since the value will be " +
                        "overwritten whenever the parent component re-renders. " +
                        "Instead, use a data or computed property based on the prop's " +
                        "value. Prop being mutated: \"" + key + "\"",
                        vm
                    );
                }
            });
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
            proxy(vm, "_props", key);
        }
    };

    for (var key in propsOptions) loop(key);
    toggleObserving(true);
}

function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ?
        getData(data, vm) :
        data || {};
    if (!isPlainObject(data)) {
        // data不是纯{}对象会报错 
    }
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        // 如果data里的数据和props还有methods有冲突就报错，因为最终都要代理到vm上
        if (!isReserved(key)) {
            proxy(vm, "_data", key);
        }
    }
    observe(data, true); //把data变为响应式
}

function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
        return data.call(vm, vm)
    } catch (e) {
        handleError(e, vm, "data()");
        return {}
    } finally {
        popTarget();
    }
}

var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
        var userDef = computed[key];
        var getter = typeof userDef === 'function' ? userDef : userDef.get;
        if ("development" !== 'production' && getter == null) {
            warn(
                ("Getter is missing for computed property \"" + key + "\"."),
                vm
            );
        }

        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions
            );
        }

        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
            defineComputed(vm, key, userDef);
        } else {
            if (key in vm.$data) {
                warn(("The computed property \"" + key + "\" is already defined in data."), vm);
            } else if (vm.$options.props && key in vm.$options.props) {
                warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
            }
        }
    }
}

function defineComputed(
    target,
    key,
    userDef
) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache ?
            createComputedGetter(key) :
            userDef;
        sharedPropertyDefinition.set = noop;
    } else {
        sharedPropertyDefinition.get = userDef.get ?
            shouldCache && userDef.cache !== false ?
            createComputedGetter(key) :
            userDef.get :
            noop;
        sharedPropertyDefinition.set = userDef.set ?
            userDef.set :
            noop;
    }
    if ("development" !== 'production' &&
        sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
            warn(
                ("Computed property \"" + key + "\" was assigned to but it has no setter."),
                this
            );
        };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
    return function computedGetter() {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value
        }
    }
}

function initMethods(vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
        {
            if (methods[key] == null) {
                warn(
                    "Method \"" + key + "\" has an undefined value in the component definition. " +
                    "Did you reference the function correctly?",
                    vm
                );
            }
            if (props && hasOwn(props, key)) {
                warn(
                    ("Method \"" + key + "\" has already been defined as a prop."),
                    vm
                );
            }
            if ((key in vm) && isReserved(key)) {
                warn(
                    "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
                    "Avoid defining component methods that start with _ or $."
                );
            }
        }
        vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    }
}

function initWatch(vm, watch) {
    for (var key in watch) {
        var handler = watch[key];
        if (Array.isArray(handler)) {
            for (var i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    }
}
