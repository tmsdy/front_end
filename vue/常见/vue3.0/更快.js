/*

1.数据劫持：Object.defineProperty -> Proxy
1）js喜欢对数据的结构越稳定越好，Object.defineProperty总是改变结构的话那可优化性就低了
2）Proxy只是对原始对象做个Proxy，没有对原始对象太多的改动

2.vdom重构：比2.0快了一倍
1）slot默认编译成函数，使父子组件不再有更新的强耦合了
2）生成vnode函数参数一致化
3）编译时给每个vnode带上它的类型

3.vdom瓶颈：每次创建都要整体创建整体对比，这样就比较粗了
1）传统vdom的性能与模板大小正相关，与模板节点数量无关。有些组件的模板节点很少的话整体遍历就有些浪费性能了
虽然说js性能够好够快不过如果项目足够大的话，还是有些影响的
<div class="parent">
    <p class="child">child</p>
    <p class="child">child</p>
    <p class="msg">{{msg}}</p>
    <p class="child">child</p>
    <p class="child">child</p>
</div>
vue这边很容易看出是就一个msg变了容易做优化，react jsx的creatElement就比较难分析了
react解决方法是时间分片，造成了伤害的一种弥补。

理想的情况就做一个msg这个节点的diff就好了

会有动态变化的地方为block area,其他都是静态的不需要变化的

2)

*/
