/* forEach
1.可以改数组，不是异步的
2.forEach可以改this绑定
3.性能比for循环低，特别长的数组不建议使用
4.在forEach中用return不会返回，函数会继续执行。官方推荐用every和some替代forEach函数。every在碰到return false的时候，中止循环。some在碰到return true的时候，中止循环
*/
let arr = [{ name: "feifei", age: 22 }]
arr.forEach(item => {
    if (item.age == 22) {
        item.age++;
    }
})
console.log(arr)

var obj = {
    id: '999'
}
let arr2 = [1, 2, 3]
arr2.forEach(function (el) {
    console.log(el, this.id)
    if (this.id === 2) return
}, obj)
arr2.every((item) => {
    console.log('every===', item)
    if (item === 2) return false
})


