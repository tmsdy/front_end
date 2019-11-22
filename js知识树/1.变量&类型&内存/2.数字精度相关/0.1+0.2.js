/*
    0.1+0.2结果不是0.3，而是0.30000000000000004
    https://www.jianshu.com/p/90ce596f131c
    https://www.cnblogs.com/shytong/p/5091600.html
*/
console.log(0.1 + 0.2) // 0.30000000000000004
console.log(2.1 + 3.2) // 5.300000000000001

console.log(Number.MAX_VALUE)
console.log(Number.MIN_VALUE)