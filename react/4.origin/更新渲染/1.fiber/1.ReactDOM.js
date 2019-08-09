import * as DOMRenderer from 'react-reconciler/inline.dom';

flushSync: DOMRenderer.flushSync,

    render(
        element: React$Element < any > ,
        container: DOMContainer, //挂在的DOM节点
        callback: ? Function, //应用渲染结束后调用的
    ) {
        return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
    }

function legacyRenderSubtreeIntoContainer(
    parentComponent: ? React$Component < any, any > ,
    children : ReactNodeList,
    container: DOMContainer,
    forceHydrate: boolean, //用来复用节点，在ssr情况下服务端第一次渲染返回和客户端生成的是一样的节点会为true，一般默认为false
    callback: ? Function,
) {
    // ...
    let root: Root = (container._reactRootContainer); //一般是没有_reactRootContainer的
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer( //创建ReactRoot根节点
            container,
            forceHydrate,
        );
        //...如果有callback
        // Initial mount should not be batched.
        DOMRenderer.unbatchedUpdates(() => {
            if (parentComponent != null) {
                root.legacy_renderSubtreeIntoContainer(
                    parentComponent,
                    children,
                    callback,
                );
            } else { //一般走这里
                root.render(children, callback);
            }
        });
    } else {
        // ...
    }
    return DOMRenderer.getPublicRootInstance(root._internalRoot);
}

function legacyCreateRootFromDOMContainer(
    container: DOMContainer,
    forceHydrate: boolean,
): Root {
    const shouldHydrate =
        forceHydrate || shouldHydrateDueToLegacyHeuristic(container);

    if (!shouldHydrate) { //非服务端渲染会走进这里
        // ...删掉传进来的container所有子节点
    }
    if (__DEV__) {
        // ...
    }
    // Legacy roots are not async by default.
    const isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function ReactRoot(
    container: Container,
    isConcurrent: boolean,
    hydrate: boolean,
) {
    const root = DOMRenderer.createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root; //创建了fiberRoot并赋值到this._internalRoot
}

ReactRoot.prototype.render = function (children, callback) {
    const root = this._internalRoot;
    // ...ReactWork相关
    // 主要走这儿
    DOMRenderer.updateContainer(children, root, null, work._onCommit);
    return work;
};
