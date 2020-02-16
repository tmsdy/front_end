

var a = 111
var funcB // 重复声明的var会被忽略
function funcB() {
    console.log('funcB111')
}
funcB = function () {
    console.log('funcB222')
}

console.log(a) // 111
funcB() // funcB222

// 等同于

/*

var funcB //函数会比变量优先被提升，函数表达式不会被提升
var a

a = 111
funcB = function () {
    console.log('funcB111')
}

funcB = function () {
    console.log('funcB222')
}

*/
