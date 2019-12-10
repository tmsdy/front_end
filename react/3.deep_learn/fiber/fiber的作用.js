/*

1.fiber之前：如果有很大，层级很深的组件，react渲染它需要几十甚至几百毫秒，在这期间，react会一直占用浏览器主线程，任何其他的操作（包括用户的点击，鼠标移动等操作）都无法执行，性能比较差。

2.fiber：时间分片 & 渲染调度
在render生命周期前的渲染是可以被打断的，让更高优先级的操作得到渲染。
但打断后render前的生命周期会重复执行，所以最好保证是个纯函数，不然结果容易出错。

3.Fiber调度算法分成两个阶段，第一个阶段创建DOM，实例，执行willXXX轻量hook，并且标记它的各种可能任务（sadeEffect）.第二个阶段才执行它们。这时它会优先进行DOM插入或移动操作，然后才是属性样式操作，didXXX重型hook，ref。

其中先操作DOM，再设置属性就是一个非常大的优化。DOM插入移除变成批处理了，样式属性也变成批处理的。

当然这是同步模式下的超级优化。更绝的是异步模式的时间分片。上面已经说了EventLoop在繁忙状态下会让页面卡顿低效。于是需要一个时间调度器。浏览器刚好实现一个requestIdleCallback。requestIdleCallback根据参数的不同，可以在限度时间内安排一定量的JS任务，从而不影响视图渲染/事件回调; 也可以强制在浏览器不断更新视图的瞎忙中，强制中断这个行为，立即安插进我们React JS逻辑。

正因为有了这个神器。我们在requestIdleCallback的回调中加入一个WorkLoop的方法，它每接触一个fiber时，就判定一下当前时间，看否有空闲时间让它进行beginWork操作（相当于刚才的第一个阶段，设置dom, instance, willXXX），没有就把它放进列队中。把控制权让渡给视图渲染。下次requestIdleCallback唤起时，从列队将刚才那个fiber取出来，执行beginWork。


参考：https://zhuanlan.zhihu.com/p/35578843


*/