/*
function createElement(
    context,
    tag,
    data, //包含节点信息的vnodeData
    children,
    normalizationType,
    alwaysNormalize
) {
  ...处理下传进来的参数
    return _createElement(context, tag, data, children, normalizationType)
}

function _createElement(context, tag, data, children, normalizationType) {
    ...
    if (normalizationType === ALWAYS_NORMALIZE) {
*        children = normalizeChildren(children); //对children处理，拿到一维数组
    } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
        var Ctor;
        if (config.isReservedTag(tag)) { // 平台的保留标签div之类的
*            vnode = new VNode( // 把处理拿到的children传进来生成VNode
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
            );
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            vnode = createComponent(Ctor, data, context, children, tag);
        } else {
            vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
            );
        }
    } else { // tag可以是组件
        vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        if (isDef(ns)) { applyNS(vnode, ns); }
        if (isDef(data)) { registerDeepBindings(data); }
        return vnode
    } else {
        return createEmptyVNode()
    }
}

function simpleNormalizeChildren(children) { // 只对children数组做一层拍平
    for (var i = 0; i < children.length; i++) {
        if (Array.isArray(children[i])) {
            return Array.prototype.concat.apply([], children)
        }
    }
    return children
}

function normalizeChildren(children) {
    return isPrimitive(children) ?
        [createTextVNode(children)] : // 是基础类型直接返回一个文本vnode
        Array.isArray(children) ?
            normalizeArrayChildren(children) : //
            undefined
}

function normalizeArrayChildren(children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
        c = children[i];
        lastIndex = res.length - 1;
        last = res[lastIndex];
        if (Array.isArray(c)) { // 嵌套的数组递归normalizeArrayChildren
            if (c.length > 0) {
                c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
                if (isTextNode(c[0]) && isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + (c[0]).text);
                    c.shift();
                }
                res.push.apply(res, c);
            }
        } else if (isPrimitive(c)) { // 基础类型则添加文本vnode
            if (isTextNode(last)) {
                res[lastIndex] = createTextVNode(last.text + c);
            } else if (c !== '') {
                res.push(createTextVNode(c));
            }
        } else {
            if (isTextNode(c) && isTextNode(last)) {
                res[lastIndex] = createTextVNode(last.text + c.text);
            } else {
                ...
                res.push(c);
            }
        }
    }
    return res
}

*/