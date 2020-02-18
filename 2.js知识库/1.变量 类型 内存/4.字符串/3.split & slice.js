// 1.split
let str1 = '2013-11-29-23-07'
let str2 = 'hanfei'

console.log(str1.split('-'))
console.log(str2.split(''))

// 2.slice
let str3 = '妙味课堂是一支独具特色的IT培训团队'
console.log(str3.slice(1)) // 味课堂是一支独具特色的IT培训团队
console.log(str3.slice(-2)) // 团队

let arr = [1, 2, 3, 4]
console.log(arr.slice(1)) // [ 2, 3, 4 ]
console.log(arr.slice(1, 2)) // [ 2 ]
console.log(arr.slice(-1)) // [ 4 ]