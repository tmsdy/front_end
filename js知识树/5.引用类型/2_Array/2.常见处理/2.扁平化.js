var arr = [1, [2, [3, 4]]];
// 1.toString暴力解决
function flatten1(arr) {
    return arr.toString().split(',').map(item => +item)
}
console.log(flatten1(arr))

// 2.利用arr.some
function flatten2(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
        // console.log(arr)
    }
    return arr;
}
console.log(flatten2(arr))

// 3.ES6的flat（需要polyfill）
// console.log(arr.flat(Infinity))