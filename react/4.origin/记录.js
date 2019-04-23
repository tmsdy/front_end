/*
1.React核心API就是setState,其余内容都围绕组件化来设计，纯粹的开发体验，一切基于组件

2.react16思想超前，核心代码改动很多但是开发者基本没感觉，不像其他框架要调整兼容
  1> 核心：引入fiber,根本上解决了js单线程如果计算量大动画卡帧交互卡顿情况

3.主要的源码包：
  1）events：onClick这种绑定事件，自己实现了一套事件传播的体系
  2）react：npm装的react也就是这个，定义节点表现行为的一个包，比较小
  3）react-dom：重度依赖react-reconciler(在react-dom和react-native都用到)，比较大
  4）scheduler：react16的一个核心包-调度，实现异步渲染的
  5）share：一些公用代码

4.
  


*/