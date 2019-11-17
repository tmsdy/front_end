/*

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

