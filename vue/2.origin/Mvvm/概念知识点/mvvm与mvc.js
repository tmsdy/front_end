/*

* MVC：单向
    View: 视图
    Controller: 控制器
    Model：数据源
Controller能控制View和Model的变化
一般是View触发事件到Controller，Controller控制Model，Model再去改View

* MVVM: 双向，数据和视图变化会自动互相影响
    View：视图、模板
    ViewModel：视图模型(vue里面的各种)
    Model：模型、数据

View 通过 ViewModel的事件监听 操作 Model数据
Model 通过 ViewModel的数据绑定 更新 View

* MVVM原理实现：
* 1）数据劫持响应式：利用Object.defineProperty实现，获取值时依赖收集，设置值时候派发更新
* 2）compile模版编译：template -> vdom -> dom diff -> 真实dom的过程
* 3）

*/