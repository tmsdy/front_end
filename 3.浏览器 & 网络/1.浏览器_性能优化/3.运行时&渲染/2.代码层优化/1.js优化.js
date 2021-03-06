/*

*1.CPU占用优化：
js会提高进程的CPU占用率，特别是出现严重内存泄漏、死循环时候，浏览器关了就没事但要在node里出事就服务器宕机崩溃了

*2.避免全局变量
1）全局变量不被回收，会造成内存泄漏。
2）访问全局变量作用域链长，性能差，访问局部变量性能好。

*3.尽量减少DOM访问：js和dom两个引擎维护，访问速度慢
1）尽量js先处理，最后操作一次dom
2）多次访问DOM节点，用局部变量存起来

*4.使用事件委托，减少事件处理器，性能更好。

*5.尽量使用css3、canvas做动画，合理使用requestAnimationFrame动画代替定时器动画
requestAnimationFrame可以在正确的时间进行渲染，setTimeout不能保证回调函数执行的时机。

*6.控制js的执行不能超过100ms，会阻塞渲染让用户感觉到卡，大概是卡了6帧的时间了。
解决：使用WebWorkers，它可以在UI线程外执行JS代码运算，不会阻塞UI线程，所以不会影响用户体验。
* 应用越复杂，主动管理UI线程就越重要

*/