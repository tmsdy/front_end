var KeepAlive = {
    name: 'keep-alive',
    abstract: true, //抽象组件，不会放到组件链中（initLifecycle里）

    props: { //keep-alive可以传的参数
        include: patternTypes, //需要缓存的组件
        exclude: patternTypes, //不需要缓存的组件
        max: [String, Number]
    },

    created: function created() {
        //缓存所有keep-alive的vnode到内存也就是this.cache
        this.cache = Object.create(null);
        this.keys = [];
    },

    destroyed: function destroyed() {
        var this$1 = this;

        for (var key in this$1.cache) {
            pruneCacheEntry(this$1.cache, key, this$1.keys);
        }
    },

    mounted: function mounted() {
        var this$1 = this;

        this.$watch('include', function (val) {
            pruneCache(this$1, function (name) { return matches(val, name); });
        });
        this.$watch('exclude', function (val) {
            pruneCache(this$1, function (name) { return !matches(val, name); });
        });
    },
    // keep-alive是手写render函数渲染的
    render: function render() {
        var slot = this.$slots.default; //拿默认插槽
        var vnode = getFirstComponentChild(slot);
        var componentOptions = vnode && vnode.componentOptions;
        if (componentOptions) {
            // check pattern
            var name = getComponentName(componentOptions);
            var ref = this;
            var include = ref.include;
            var exclude = ref.exclude;
            if (
                // not included
                (include && (!name || !matches(include, name))) ||
                // excluded
                (exclude && name && matches(exclude, name))
            ) {
                return vnode
            }

            var ref$1 = this;
            var cache = ref$1.cache;
            var keys = ref$1.keys;
            var key = vnode.key == null
                // same constructor may get registered as different local components
                // so cid alone is not enough (#3269)
                ?
                componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '') :
                vnode.key;
            if (cache[key]) {
                vnode.componentInstance = cache[key].componentInstance;
                // make current key freshest
                remove(keys, key);
                keys.push(key);
            } else {
                cache[key] = vnode;
                keys.push(key);
                // prune oldest entry
                if (this.max && keys.length > parseInt(this.max)) {
                    pruneCacheEntry(cache, keys[0], keys, this._vnode);
                }
            }

            vnode.data.keepAlive = true;
        }
        return vnode || (slot && slot[0])
    }
}

var builtInComponents = {
    KeepAlive: KeepAlive
}

/*  */

function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; }; {
        configDef.set = function () {
            warn(
                'Do not replace the Vue.config object, set individual fields instead.'
            );
        };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
        warn: warn,
        extend: extend,
        mergeOptions: mergeOptions,
        defineReactive: defineReactive
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
        Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    // 一开始把内置的keep-alive组件放到vue上，这样在哪都能用keep-alive组件了
    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
}

initGlobalAPI(Vue);
