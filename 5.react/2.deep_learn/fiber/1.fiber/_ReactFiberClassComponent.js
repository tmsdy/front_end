const classComponentUpdater = {
    isMounted,
    enqueueSetState(inst, payload, callback) { // SetState的源码
        const fiber = ReactInstanceMap.get(inst); //获取fiber对象
        const currentTime = requestCurrentTime();
        const expirationTime = computeExpirationForFiber(currentTime, fiber);

        const update = createUpdate(expirationTime);
        update.payload = payload;
        // ...
        enqueueUpdate(fiber, update);
        scheduleWork(fiber, expirationTime);
    },
    enqueueReplaceState(inst, payload, callback) {
        const fiber = ReactInstanceMap.get(inst);
        const currentTime = requestCurrentTime();
        const expirationTime = computeExpirationForFiber(currentTime, fiber);

        const update = createUpdate(expirationTime);
        update.tag = ReplaceState;
        update.payload = payload;

        if (callback !== undefined && callback !== null) {
            if (__DEV__) {
                warnOnInvalidCallback(callback, 'replaceState');
            }
            update.callback = callback;
        }

        enqueueUpdate(fiber, update);
        scheduleWork(fiber, expirationTime);
    },
    enqueueForceUpdate(inst, callback) { // ForceUpdate的源码
        const fiber = ReactInstanceMap.get(inst);
        const currentTime = requestCurrentTime();
        const expirationTime = computeExpirationForFiber(currentTime, fiber);

        const update = createUpdate(expirationTime);
        update.tag = ForceUpdate;
        // ...

        enqueueUpdate(fiber, update);
        scheduleWork(fiber, expirationTime);
    },
};
