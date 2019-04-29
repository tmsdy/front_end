var arr = [1, [2, [3, 4]]];
// 1.toString暴力解决
function flatten1(arr) {
    return arr.toString().split(',').map(item=>+item)
}
console.log(flatten1(arr))

// 2.
function flatten2(arr) {
    while (arr.some(item => Array.isArray(item))) {
      arr = [].concat(...arr);
    }
    return arr;
}
console.log(flatten2(arr))
// 3.看underscore源码