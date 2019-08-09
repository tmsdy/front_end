export function createFiberRoot(
    containerInfo: any,
    isConcurrent: boolean,
    hydrate: boolean,
): FiberRoot {
    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber(isConcurrent);

    let root;
    if (enableSchedulerTracing) {
        root = ({
            current: uninitializedFiber, //fiber树的定点
            containerInfo: containerInfo,
            pendingChildren: null,

            earliestPendingTime: NoWork,
            latestPendingTime: NoWork,
            earliestSuspendedTime: NoWork,
            latestSuspendedTime: NoWork,
            latestPingedTime: NoWork,

            didError: false,
            // 正在等待提交的任务的 ‘expirationTime’
            pendingCommitExpirationTime: NoWork,
            // 记录在一次更新渲染中完成(根据优先级渲染)了的更新任务，更新完时候读取出来渲染到DOM即可
            finishedWork: null,
            // 
            timeoutHandle: noTimeout,
            context: null,
            pendingContext: null,
            hydrate,
            // 标记这次更新渲染要执行那个优先级的任务
            nextExpirationTimeToWorkOn: NoWork,
            // 用在调度过程中
            expirationTime: NoWork,
            firstBatch: null,
            // root之间关联的链表结构，调用ReactDOM.render渲染到root1和root2，用nextScheduledRoot来串联
            nextScheduledRoot: null,

            interactionThreadID: unstable_getThreadID(),
            memoizedInteractions: new Set(),
            pendingInteractionMap: new Map(),
        }: FiberRoot);
    } else {
        root = ({
            current: uninitializedFiber,
            containerInfo: containerInfo,
            pendingChildren: null,

            earliestPendingTime: NoWork,
            latestPendingTime: NoWork,
            earliestSuspendedTime: NoWork,
            latestSuspendedTime: NoWork,
            latestPingedTime: NoWork,

            didError: false,

            pendingCommitExpirationTime: NoWork,
            finishedWork: null,
            timeoutHandle: noTimeout,
            context: null,
            pendingContext: null,
            hydrate,
            nextExpirationTimeToWorkOn: NoWork,
            expirationTime: NoWork,
            firstBatch: null,
            nextScheduledRoot: null,
        }: BaseFiberRootProperties);
    }

    uninitializedFiber.stateNode = root;

    // The reason for the way the Flow types are structured in this file,
    // Is to avoid needing :any casts everywhere interaction tracing fields are used.
    // Unfortunately that requires an :any cast for non-interaction tracing capable builds.
    // $FlowFixMe Remove this :any cast and replace it with something better.
    return ((root: any): FiberRoot);
}
