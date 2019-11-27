function initRender(vm) {
    //   ...
    // 编译template生成render函数走这儿
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // 手写render走这儿
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
    //   ...
}

Vue.prototype._render = function () { //返回vnode
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;
    // ...对slot的处理

    vm.$vnode = _parentVnode;
    var vnode;
    try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
        //第一个参数是当前上下文，生产环境就是vm，在这里触发的getter，把render传入$createElement在里面生成vnode
    } catch (e) {
        handleError(e, vm, "render"); {
            if (vm.$options.renderError) {
                try {
                    vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                } catch (e) {
                    handleError(e, vm, "renderError");
                    vnode = vm._vnode;
                }
            } else {
                vnode = vm._vnode;
            }
        }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
        if ("development" !== 'production' && Array.isArray(vnode)) {
            warn(
                'Multiple root nodes returned from render function. Render function ' +
                'should return a single root node.',
                vm
            );
        }
        vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
};
