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
    let { render, _parentVnode } = vm.$options // 拿到render函数
    // ...对slot的处理
    vm.$vnode = _parentVnode;
    /*
        _renderProxy是当前上下文，是vm 或者 new Proxy(vm, handles)
        在这里触发的getter，把render传入$createElement在里面生成vnode并返回
    */
    var vnode = render.call(vm._renderProxy, vm.$createElement)
    // set parent
    vnode.parent = _parentVnode;
    return vnode
};
