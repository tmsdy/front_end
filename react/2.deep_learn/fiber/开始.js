/*

1.react更新渲染的三种方式
ReactDOM.render || hydrate，setState,forceUpdate

2.ReactDOM.render || hydrate
1) 创建ReactRoot根节点
2）创建FiberRoot和RootFiber
3) 创建更新，之后应用就到了更新调度的阶段，就由调度器来决定是什么渲染API

3.fiberRoot
1）整个应用的起点，包含应用挂在的目标节点。
2）记录整个应用更新过程中的各种信息：各种不同类型的expirationTime，异步调度任务的callback。
3）任何一个reactElement都会对应一个fiber对象，RootFiber是这个树的根。

4.fiber对象
1）任何一个reactElement都会对应一个fiber对象
2）class组件的state和props都是记录在这个fiber对象上的，然后在fiber更新后才会放到到class组件上面this.state、this.props里面。state和props的变化都是在fiber上操作的。这也给react的hooks实现提供的可行性，因为本来记录state和props是不依赖class组件的
3）串联整个应用树结构

*/
