/*
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope
    }
    return f()
}
checkscope(); //'local scope'
* 1.创建全局执行上下文被压入执行上下文栈：ECStack = [ globalContext ]

* 2.全局执行上下文初始化
  globalContext: {
    VO: [global],
    Scope: [globalContext.VO], // 作用域链存的是每个上下文里的变量对象
    this: globalContext.VO
  }

* 3.函数预编译：创建函数，保存当前作用域链到函数的内部属性[[scope]] -> 体现了js的词法作用域
checkscope.[[scope]] = [ globalContext.VO ];

* 4.执行函数，创建函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈
ECStack = [ checkscopeContext, globalContext ]
然后函数执行上下文初始化：
    * 1）复制函数 [[scope]] 属性创建作用域链（闭包的真正原理）
    * 2）用 arguments 创建活动对象(AO)并初始化：加入形参、函数声明、变量声明
    * 3）将活动对象AO压入Scope作用域链顶端
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope: undefined,
        f: reference to function f(){}
    },
    Scope: [AO, globalContext.VO], //Scope是作用域链里面有当前AO和保存的VO(变量对象)
    this: undefined
}
...f函数的处理同理省略

* 5.函数执行完毕，函数执行上下文从执行上下文栈中弹出
ECStack = [ globalContext ]

 */