/*
*1.babel 转义 let
if (false) {
    let value = 1;
}
console.log(value) // value is not defined

if (false) {
    var _value = 1;
}
console.log(value) // value is not defined

*2.循环中的let
var funcs = [];
for (let i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    }
}
funcs[0]() //0

var funcs = [];
for (var i = 0; i < 10; i++) {
    (function (i) { // 利用函数生成新的作用域，仿闭包
        funcs[i] = function () {
            console.log(i)
        }
    })(i)
}
funcs[0](); //0

*/
