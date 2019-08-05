// DOMRender
import {createFiberRoot} from './1_ReactFiberRoot';

export function createContainer(containerInfo,isConcurrent,hydrate) {
  // 创建FiberRoot
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}

export function updateContainer(
  element: ReactNodeList, // <App />
  container: OpaqueRoot, // 生成的fiberRoot
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTime();
  // 计算expirationTime，这个能让我们可以实用concurrentMode实现优先级更新
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(element,container,parentComponent,expirationTime,callback)
}

export function updateContainerAtExpirationTime(element,container,parentComponent,expirationTime,
  callback) {
  const current = container.current;
// ...dev的
// ...context的

  return scheduleRootUpdate(current, element, expirationTime, callback);
}

function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
 // ...dev的
// update用来标记react应用需要更新的地点
  const update = createUpdate(expirationTime);
  update.payload = {element};
// ...处理callback
// 把update加入到fiber对象上对应的updateQueue,因为update在一次更新在这个节点可以多个更新
  enqueueUpdate(current, update);
// 告诉react有更新产生了，开始按照优先级调度更新
  scheduleWork(current, expirationTime);
  return expirationTime;
}