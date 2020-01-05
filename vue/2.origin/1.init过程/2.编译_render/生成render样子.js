
// 包含被拍成一维数组的vnodeData的render函数和传入new VNode类生成的总vnode(vdom)
(function anonymous() {
    with (this) {
        return _c("div", [
            _c("p", [_v("Name: " + _s(name))]),
            _v(" "),
            _c("p", [_v("Name: " + _s(getName()))]),
            _v(" "),
            _c("p", [
                _v("firstName:" + _s(firstName)),
                _c("input", {
                    directives: [
                        {
                            name: "model",
                            rawName: "v-model",
                            value: firstName,
                            expression: "firstName"
                        }
                    ],
                    attrs: { type: "text" },
                    domProps: { value: firstName },
                    on: {
                        input: function ($event) {
                            if ($event.target.composing) return;
                            firstName = $event.target.value;
                        }
                    }
                })
            ]),
            _v(" "),
            _c("p", [
                _v("age:" + _s(age)),
                _c("input", {
                    directives: [
                        {
                            name: "model",
                            rawName: "v-model",
                            value: age,
                            expression: "age"
                        }
                    ],
                    attrs: { type: "text" },
                    domProps: { value: age },
                    on: {
                        input: function ($event) {
                            if ($event.target.composing) return;
                            age = $event.target.value;
                        }
                    }
                })
            ])
        ])
    }
})
var VNode = function VNode(
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
};
// vnode
{
    asyncFactory: undefined;
    asyncMeta: undefined;
    children: Array(13);
    componentInstance: undefined;
    componentOptions: undefined;
    context: Vue;
    data: undefined;
    elm: undefined;
    fnContext: undefined;
    fnOptions: undefined;
    fnScopeId: undefined;
    isAsyncPlaceholder: false;
    isCloned: false;
    isComment: false;
    isOnce: false;
    isRootInsert: true;
    isStatic: false;
    key: undefined;
    ns: undefined;
    parent: undefined;
    raw: false;
    tag: "div";
    text: undefined;
    child: undefined;
}