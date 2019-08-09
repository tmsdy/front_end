/*
fiberRoot.current 是 RootFiber
RootFiber.statusNode 是 fiberRoot
RootFiber.child 是 App

深度优先遍历：遍历的时候很方便，通过child一直找到叶子节点，叶子节点没有子节点和兄弟节点就返回父级节点再看有没兄弟节点遍历，没有就继续从return找父节点再来。最终会返回到RootFiber
*/

// Fiber对应一个组件需要被处理或者已经处理了，一个组件可以有一个或者多个Fiber
type Fiber = {
  tag,// 标记不同的组件类型：原生DOM、class组件、函数组件

  key: null | string, // ReactElement里面的key

  // ReactElement.type，也就是我们调用`createElement`的第一个参数
  elementType: any,

  // 异步组件resolved之后返回的内容，一般是`function`或者`class`
  type: any,

  // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）,不同类型节点对应的实例
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,
  child: Fiber | null,// 单链表树结构,指向自己的第一个子节点
  // 指向自己的兄弟节点，兄弟节点的return指向同一个父节点
  sibling: Fiber | null,

  index: number,

  // ref属性
  ref,

  // 新的变动带来的新的props
  pendingProps: any,
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件setState、forceUpdate产生的Update会存放在这个队列里面，
  updateQueue,

  // 之前的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency,

  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // Fiber被创建的时候他会继承父Fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode,

  // 用来记录Side Effect
  effectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 当前节点更新产生的任务的过期时间
  expirationTime,

  // 子节点更新产生的任务的过期时间
  childExpirationTime,

  // 在Fiber树更新的过程中，每个Fiber都会clone个新fiber(alternate)，然后两个Fiber diff出的变化记录在alternate上，更新完成后alternate取代current成为新的current节点
  alternate: Fiber | null,

  // 下面是调试相关的，收集每个Fiber和子树渲染时间的
  actualDuration?: number,
  actualStartTime?: number,
  selfBaseDuration?: number,
  treeBaseDuration?: number,
  _debugID?: number,
  _debugSource?,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean,
};
