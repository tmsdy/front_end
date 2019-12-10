/*
命令式开发：jq之类的，经常操作DOM，比较差
声明式开发：react、vue之类的

1.响应式数据场景
1）长数组列表点个单个改变状态：react得setState一遍数组找到点击的子数据改，vue直接改就行了。
2）后端返回一堆可能存在可能不存在的字段：react多个if加setState。vue直接改就行了。
3）需要拿到改变后的state再操作时：为了时间分片，setState必须异步，这样需要同步获取setState，每次同步获取setState就需要多渲染一次。vue直接改就行了。
4）一个组件有超过10个甚至30个state：要写一堆useState,就算几个放一起也必须同时几个一起设置，太捞了。vue直接改就行了。

2.性能方面
Vue:
 1) 用Proxy代替Object.defineProperty，解决了不能改数组索引的问题还有提高了响应数据变化的速度。
 2）优化传统虚拟DOM diff的性能瓶颈，采用block tree的策略，静态节点标记。快5-6倍，1w2个dom diff只需5ms
 3）
React:
 1) fiber时间分片、调度。在eventloop一个tick中js执行时间过长会导致渲染延迟，页面就变卡。
于是需要一个时间调度器。浏览器刚好实现一个requestIdleCallback。requestIdleCallback根据参数的不同，可以在限度时间内安排一定量的JS任务，从而不影响视图渲染/事件回调; 也可以强制在浏览器不断更新视图的瞎忙中，强制中断这个行为，立即安插进我们React JS逻辑。
我们在requestIdleCallback的回调中加入一个WorkLoop的方法，它每接触一个fiber时，就判定一下当前时间，看否有空闲时间让它进行beginWork操作（相当于刚才的第一个阶段，设置dom, instance, willXXX），没有就把它放进列队中。把控制权让渡给视图渲染。下次requestIdleCallback唤起时，从列队将刚才那个fiber取出来，执行beginWork。

*/
