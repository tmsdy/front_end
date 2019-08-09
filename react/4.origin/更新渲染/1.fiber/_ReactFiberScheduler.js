let expirationContext = NoWork;

function requestCurrentTime() {

    if (isRendering) { // 一般不走这
        return currentSchedulerTime;
    }
    findHighestPriorityRoot();
    if (
        nextFlushedExpirationTime === NoWork ||
        nextFlushedExpirationTime === Never
    ) { //一般走这
        recomputeCurrentRendererTime(); //由一些常量算出一个比较固定的值
        currentSchedulerTime = currentRendererTime;
        return currentSchedulerTime;
    }

    return currentSchedulerTime;
}

function findHighestPriorityRoot() {
    let highestPriorityWork = NoWork;
    let highestPriorityRoot = null;
    if (lastScheduledRoot !== null) {
        let previousScheduledRoot = lastScheduledRoot;
        let root = firstScheduledRoot;
        while (root !== null) {
            const remainingExpirationTime = root.expirationTime;
            if (remainingExpirationTime === NoWork) {
                // This root no longer has work. Remove it from the scheduler.

                // TODO: This check is redudant, but Flow is confused by the branch
                // below where we set lastScheduledRoot to null, even though we break
                // from the loop right after.
                invariant(
                    previousScheduledRoot !== null && lastScheduledRoot !== null,
                    'Should have a previous and last root. This error is likely ' +
                    'caused by a bug in React. Please file an issue.',
                );
                if (root === root.nextScheduledRoot) {
                    // This is the only root in the list.
                    root.nextScheduledRoot = null;
                    firstScheduledRoot = lastScheduledRoot = null;
                    break;
                } else if (root === firstScheduledRoot) {
                    // This is the first root in the list.
                    const next = root.nextScheduledRoot;
                    firstScheduledRoot = next;
                    lastScheduledRoot.nextScheduledRoot = next;
                    root.nextScheduledRoot = null;
                } else if (root === lastScheduledRoot) {
                    // This is the last root in the list.
                    lastScheduledRoot = previousScheduledRoot;
                    lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
                    root.nextScheduledRoot = null;
                    break;
                } else {
                    previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot;
                    root.nextScheduledRoot = null;
                }
                root = previousScheduledRoot.nextScheduledRoot;
            } else {
                if (
                    highestPriorityWork === NoWork ||
                    remainingExpirationTime < highestPriorityWork
                ) {
                    // Update the priority, if it's higher
                    highestPriorityWork = remainingExpirationTime;
                    highestPriorityRoot = root;
                }
                if (root === lastScheduledRoot) {
                    break;
                }
                if (highestPriorityWork === Sync) {
                    // Sync is highest priority by definition so
                    // we can stop searching.
                    break;
                }
                previousScheduledRoot = root;
                root = root.nextScheduledRoot;
            }
        }
    }

    nextFlushedRoot = highestPriorityRoot;
    nextFlushedExpirationTime = highestPriorityWork;
}

function interactiveUpdates(fn, a, b) { //大部分事件绑定更新都走这个
    if (isBatchingInteractiveUpdates) {
        return fn(a, b);
    }
    if (
        !isBatchingUpdates &&
        !isRendering &&
        lowestPriorityPendingInteractiveExpirationTime !== NoWork
    ) {
        performWork(lowestPriorityPendingInteractiveExpirationTime, null);
        lowestPriorityPendingInteractiveExpirationTime = NoWork;
    }
    const previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates;
    const previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingInteractiveUpdates = true;
    isBatchingUpdates = true;
    try {
        return fn(a, b);
    } finally {
        isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
        isBatchingUpdates = previousIsBatchingUpdates;
        if (!isBatchingUpdates && !isRendering) {
            performSyncWork();
        }
    }
}

function deferredUpdates() {
    const currentTime = requestCurrentTime();
    const previousExpirationContext = expirationContext;
    const previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates;
    expirationContext = computeAsyncExpiration(currentTime); //计算优先级最低的
    isBatchingInteractiveUpdates = false;
    try {
        return fn();
    } finally {
        expirationContext = previousExpirationContext;
        isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
    }
}

function flushSync(fn, a) {
    //...
    const previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
        return syncUpdates(fn, a);
    } finally {
        isBatchingUpdates = previousIsBatchingUpdates;
        performSyncWork();
    }
}

function syncUpdates(fn, a, b, c, d) {
    const previousExpirationContext = expirationContext;
    expirationContext = Sync; //赋值Sync
    try {
        return fn(a, b, c, d); //这个就是setState
    } finally {
        expirationContext = previousExpirationContext;
    }
}

function computeExpirationForFiber(currentTime, fiber) {
    let expirationTime;
    if (expirationContext !== NoWork) { //可能是Sync，在外部使用flushSync强制提高优先级时候
        expirationTime = expirationContext;
    } else if (isWorking) {
        if (isCommitting) {
            expirationTime = Sync;
        } else {
            expirationTime = nextRenderExpirationTime;
        }
    } else { //没有外部强制的情况
        if (fiber.mode & ConcurrentMode) { //ConcurrentMode情况下都是同步更新
            if (isBatchingInteractiveUpdates) {
                expirationTime = computeInteractiveExpiration(currentTime);
            } else {
                expirationTime = computeAsyncExpiration(currentTime);
            }
            if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
                expirationTime += 1;
            }
        } else { // 否则异步更新
            expirationTime = Sync;
        }
    }
    if (isBatchingInteractiveUpdates) {
        if (expirationTime > lowestPriorityPendingInteractiveExpirationTime) {
            lowestPriorityPendingInteractiveExpirationTime = expirationTime;
        }
    }
    return expirationTime;
}
