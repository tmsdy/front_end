
var mount = Vue.prototype.$mount; //缓存的默认的mount方法

Vue.prototype.$mount = function (el, hydrating) { //runtime+compiler版本会重新赋值$mount方法
    el = el && query(el); //el是元素el否则就document.querySelector(el)取一下
    // ...
    var options = this.$options;
    // 优先 render -> template -> 外部html
    if (!options.render) {
        var template = options.template;
        if (template) { //有template的处理
            //   ...
        } else if (el) { //通过外部html生成 template
            template = getOuterHTML(el);
        }
        if (template) { //编译过程,用template生成render函数(vue只认这个)
            //   ...
            var ref = compileToFunctions(template, {
                shouldDecodeNewlines: shouldDecodeNewlines,
                shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
                delimiters: options.delimiters,
                comments: options.comments
            }, this);
            var render = ref.render;
            var staticRenderFns = ref.staticRenderFns;
            options.render = render;
            options.staticRenderFns = staticRenderFns;
            //   ...
        }
    }
    return mount.call(this, el, hydrating) //有了render函数调用这个，实际走到mountComponent方法
};

function mountComponent(vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) { //如果没写render并且template没转化为render
        vm.$options.render = createEmptyVNode;
        //   ...报一些警告
    }
    callHook(vm, 'beforeMount');
    // ...
    var updateComponent = function () {
        vm._update(vm._render(), hydrating);
    };

    new Watcher(vm, updateComponent, noop, { // 实例化渲染Watcher，里面调this.get()更新页面
        before: function before() {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook(vm, 'beforeUpdate');
            }
        }
    }, true);
    hydrating = false;

    if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook(vm, 'mounted');
    }
    return vm
}
