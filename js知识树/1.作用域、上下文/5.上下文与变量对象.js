/*
1.全局上下文与全局对象
    1) 全局对象是预定义的对象，通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性.
    2) 全局对象是作用域链的头,用parseInt()函数时，它引用的是全局对象的parseInt。
    3) 全局对象是作用域链的头，在顶层 Js代码中声明的所有变量都将成为全局对象的属性。

2.函数上下文：进入到函数上下文分成两个阶段进行：进入执行上下文和代码执行
1）进入执行上下文
    1>复制函数 [[scope]] 属性创建作用域链（闭包的真正原理）
    2>arguments初始化活动对象(AO)，其实和变量对象(VO一个东西)：
        加入形参：由名称和对应值组成的一个变量对象的属性被创建，如果没有实参，属性值设为 undefined
        函数声明：由名称和对应值组成一个变量对象的属性被创建
        变量声明：由名称和对应值（undefined）组成一个变量对象的属性被创建；
                如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性
    3>将活动对象AO压入Scope作用域链顶端
举个栗子：
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};
  b = 3;
}
foo(1);
进入执行上下文后，这时候的AO是：
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
2）代码执行
    在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
代码执行完：
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
并且当前的上下文栈弹出

*/

