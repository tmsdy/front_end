/*
    0.1+0.2结果不是0.3，而是0.30000000000000004
    https://www.jianshu.com/p/90ce596f131c
    https://www.cnblogs.com/shytong/p/5091600.html
*/
/*
为什么会精度不对？
1.0.1用二进制存的样子：2^-4 * 1.10011(0011)，但JS采用IEEE754双精度版本（64位），但这个浮点数标准会裁掉我们的二进制
数字

*/
console.log(0.1 + 0.2) // 0.30000000000000004
console.log(2.1 + 3.2) // 5.300000000000001

console.log(Number.MAX_VALUE)
console.log(Number.MIN_VALUE)


/*

解决：
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true

*/
