/*

NaN，即非数值（Not a Number）是一个特殊的数值, 不喜欢数字、讨厌数字 false 别的都是true
这个数值用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）。 
任何数值除以 0 会返回 NaN，不会影响其他代码的执行。
特点:  1.任何涉及 NaN 的操作（例如 NaN/10）都会返回 NaN ,
        2.NaN 与任何值都不相等，包括 NaN 本身。

console.log(NaN == NaN); //false
console.log(isNaN(NaN)); //true
console.log(isNaN(10)); //false（ 10 是一个数值）
console.log(isNaN("10")); //false（可以被转换成数值 10）
console.log(isNaN("blue")); //true（不能转换成数值）
console.log(isNaN(true)); //false（可以被转换成数值 1）

 */
