// 1.b的打印值是？
var b = 10;
(function b() { // 匿名函数的AO有这个函数b, 具名自执行函数的变量为只读属性，不可修改
    b = 20 // 这里改不动函数b
    console.log(b) //函数b
})()
console.log(b) // 10

// 2.打印10
var c = 10;
(function () {
    console.log(c) // 先打印10
    c = 20 // 后赋值全局的c
})()

// 3.打印20
var d = 10;
(function () {
    d = 20 // 这种赋值会先沿作用域链找，找到b就赋值，找不到就挂在全局上
    console.log(d)
})()
// console.log(d) // 20 说明d = 20