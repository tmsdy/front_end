// 1.可以改数组，不是异步的
let arr = [
    {
        name: "feifei",
        age: 22
    },
    {
        name: "fangfang",
        age: 20
    }
]
arr.forEach(item => {
    if (item.age == 22) {
        item.age++;
    }
})
console.log(arr)

// 2.forEach可以改this绑定
function foo(el) {
    console.log(el, this.id)
}
var obj = {
    id: '999'
}
let arr2 = [1, 2, 3]
arr2.forEach(foo, obj)
// 3.性能比for循环低，特别长的数组不建议使用

