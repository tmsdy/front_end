// 1.toString()
var age = 11;
var found = true;
console.log(age.toString()); // "11"
console.log(found.toString()); // "true"

var num = 10;
console.log(num.toString()); // "10"
console.log(num.toString(2)); // 转为2进制 "1010"

// 2. String()，null 和 undefined 没有 toString()方法，所以 String()函数就返回了这两个值的字面量。
var value1 = 10;
console.log(String(value1)); // "10"
var value3 = null;
console.log(String(value3)); // "null"
var value4;
console.log(String(value4)); // "undefined"

// 3. 字符字面量 \n换行 \t制表 \r回车

/**
 * 4.ECMAscript 的字符串是不可变的
 * 下面的过程:创建一个能容纳十个字符的新字符串用"java""script"填充，最后销毁"java""script"字符串
 *  */ 
    let lang = "java" ;
    lang = lang + "script" ; 
    
// 5.