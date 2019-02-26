// 提醒我们在使用两个函数parseInt和map时候要格外小心

console.log(["1","2","3"].map(parseInt)) //[ 1, NaN, NaN ]

/*

["1", "2", "3"].map(parseInt)
对应
[parseInt("1", 0), parseInt("2", 1), parseInt("3", 2)] parseInt("3", 2)



*/