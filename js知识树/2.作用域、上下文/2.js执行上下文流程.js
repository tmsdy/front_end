var scope = '全局 scope'
function checkscope(a){ //由于js词法作用域，在函数声明会保存当前作用域链到函数的内部属性[[scope]]
    var scope = "函数内 scope";
    function f(){
        console.log(scope)
    }
    return f();
}
checkscope(1) // 函数执行才开始创建函数上下文，同时
/*

1.执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈 -> 然后全局上下文初始化
ECStack = [ // 执行上下文栈，程序结束才会清空，最下面是globalContext
    globalContext：{
        VO: [global],
        Scope: [globalContext.VO], // 作用域链存的是每个上下文里的变量对象
        this: globalContext.VO
    }
]

2.函数预编译：checkscope函数被创建，保存当前作用域链到函数的内部属性[[scope]] ->体现了js的词法作用域
checkscope.[[scope]] = [ globalContext.VO ]

3.执行checkscope函数，创建函数执行上下文并压入执行上下文栈顶
ECStack = [
  checkscopeContext,
  globalContext: {...}
]
4.checkscope 函数执行上下文初始化：
  1) 复制函数 [[scope]] 属性创建作用域链（闭包的真正原理，作用域链被保存了）
  2) 用 arguments 创建活动对象(AO)并初始化：加入形参、函数声明、变量声明。
  3) 将活动对象AO压入Scope作用域链顶端。
  4) 开始执行函数，随着函数的执行，修改 AO 的属性值
  5）函数执行完毕，函数上下文从执行上下文栈中弹出
ECStack = [
  checkscopeContext: {
        AO: {
            arguments: {
                length: 0
            },
            a: undefined,
            scope: undefined,
            f: reference to function f(){}
        },
        Scope: [AO, globalContext.VO], //Scope是作用域链里面有当前AO和保存的VO(变量对象)
        this: undefined
  },
  globalContext: {...}
]
f.[[scope]] = [ checkscopeContext.VO, globalContext.VO ]
以此类推...

 */