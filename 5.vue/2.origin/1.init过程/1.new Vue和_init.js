function Vue(options) {
    // ...
    this._init(options);
}
// 引入Vue会自动走下面几个方法初始化，其中initMixin定义了_init初始化的方法
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        var vm = this;
        vm._uid = uid$3++;
        // ...
        // 将传入的options和默认的options作个merge
        vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)
        // ...
        vm._self = vm;
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);

        callHook(vm, 'beforeCreate');
        initState(vm);
        callHook(vm, 'created');
        // ...

        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
}
