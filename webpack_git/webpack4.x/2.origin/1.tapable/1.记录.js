/*

* 1.Tapable是webpack的灵魂
1）webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable钩子机制。
2）webpack的核心类：Compiler、Compilation、各种ModuleFactory都是Tapable的实例

* 2.tapable库里有sync和async的钩子
普通型：按照注册顺序一个个向下执行。
熔断型：如果有返回值或传值非null，停止继续执行。
流水型：如果有返回值或传值，会作为下个注册的事件的参数。
* Sync串行同步钩子：注册在该钩子下面的插件的执行顺序都是顺序执行。只能tap注册，触发用call
    1）SyncHook：普通型。(常用 69次)
    2）SyncBailHook：熔断型。(常用 63次)
    3）SyncWaterfallHook：流水型。(常用 36次)
    4）SyncLoopHook：监听函数返回true则继续循环，返回undefined表示结束循环(不用 0次)

* Async异步钩子：支持tap、tapPromise和tapAsync注册，一般用tapAsync注册，触发用callAsync
异步并行钩子（不常用）
    1）AsyncParallelHook：异步并行执行，有一个失败了其他还走，最终失败。(不常用 1次)
    2）AsyncParallelBailHook：异步并行执行，有一个失败了其他的就不走了，最终失败。(不用 0次)
异步串行钩子（常用）
    3）AsyncSeriesHook：普通型(常用 14次)
    4）AsyncSeriesBailHook：熔断型(不用 0次)
    5）AsyncSeriesWaterfallHook：流水型(常用 5次)

* Async和sync的区别在于Async通过callback来和后续的函数沟通，sync则是通过return一个值来做交流。所以，Async自带sync中bail类型的钩子。

*/