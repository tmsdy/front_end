var data = [];

for (var i = 0; i < 3; i++) { //用let声明的话i就在块级作用域里而不是全局作用域里
    data[i] = function () {
        console.log(i);
    };
}

data[0]();
data[1]();
data[2]();
/*
当执行到 data[0] 函数之前，此时全局上下文的 VO 为：
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
当执行 data[0] 函数的时候，data[0] 函数的作用域链为：
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。
data[1] 和 data[2] 是一样的道理
有了闭包：
for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}
当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

data[0]Context = {
    Scope: [AO, 匿名函数Context.AO globalContext.VO]
}
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0。

data[1] 和 data[2] 是一样的道理。
*/