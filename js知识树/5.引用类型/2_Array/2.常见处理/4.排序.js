//* MDN: Array.sort()默认的排序方法会将数组元素转换为字符串，然后比较字符串中字符的UTF-16编码顺序来进行排序。所以'102' 会排在 '15' 前面
console.log([3, 15, 8, 29, 102, 22].sort()) //[ 102, 15, 22, 29, 3, 8 ]

// 升序：a - b 降序：b - a
let arr = [3, 15, 8, 29, 102, 22].sort(function (a, b) {
    return a - b;
})
console.log(arr)