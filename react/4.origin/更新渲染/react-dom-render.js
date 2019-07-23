/*

1.react更新渲染的三种方式
ReactDOM.render || hydrate，setState,forceUpdate

2.ReactDOM.render || hydrate
1) 创建ReactRoot跟节点
2）创建FiberRoot和RootFiber
3) 创建更新，之后应用就到了更新调度的阶段，就由调度器来决定是什么渲染API

*/