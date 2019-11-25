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


*/
