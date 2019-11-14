// DOMRender
import { createFiberRoot } from './1_ReactFiberRoot';

export function createContainer(containerInfo, isConcurrent, hydrate) {
    // 创建FiberRoot
    return createFiberRoot(containerInfo, isConcurrent, hydrate);
}

export function updateContainer(
    element, // <App />
    container, // 生成的fiberRoot
    parentComponent,
    callback,
): ExpirationTime {
    const current = container.current;
    const currentTime = requestCurrentTime(); //与当前时间和js加载完成时间之间的差相关的时间
    const expirationTime = computeExpirationForFiber(currentTime, current);

    return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback)
}

export function updateContainerAtExpirationTime(element, container, parentComponent, expirationTime,
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
    callback: ? Function,
) {
    // ...dev的
    // update用来标记react应用需要更新的地点
    const update = createUpdate(expirationTime);
    update.payload = { element };
    // ...处理callback
    // 把update加入到fiber对象上对应的updateQueue,因为update在一次更新在这个节点可以多个更新
    enqueueUpdate(current, update);
    // 告诉react有更新产生了，开始按照优先级调度更新
    scheduleWork(current, expirationTime);
    return expirationTime;
}
