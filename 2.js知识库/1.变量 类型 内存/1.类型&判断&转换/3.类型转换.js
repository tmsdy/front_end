/*

1.原始值转化为原始值
    转布尔值：所有的假值(undefined、null、0、-0、NaN、””)会被转化为 false，其他都会被转为 true

    转字符串：原始值 + ""

    布尔转数字：true -> 1, false -> 0
    字符串转数字：头尾有空格会忽略，但是空格在中间，转换结果就是 NaN。
        +" 66" -> 66
        +" 6 7 " // NaN

2.对象到原始值的转换：https://juejin.im/post/5b6906b46fb9a04fcb5b8771

3. == 运算符如何进行类型转换
判断类型 -> 是不是null和undefined -> string转number -> bool转number -> object类型转基本类型
    1）如果一个值是null，另一个值是undefined，则相等
    2）如果一个是字符串，另一个值是数字，则把字符串转换成数字，进行比较
    3）如果任意值是true，则把true转换成1再进行比较；如果任意值是false，则把false转换成0再进行比较
    4）如果一个是对象，另一个是数值或字符串，把对象转换成基础类型的值再比较。对象转换成基础类型，利用它的 toString 或者 valueOf 方法。
        js 核心内置类，会尝试 valueOf 先于 toString（可以理解为对象优先转换成数字）；例外的是 Date，Date 利用的是 toString 转换。非 js 核心的对象，
        通过自己的实现中定义的方法转换成原始值。
4.
*/
console.log(null == undefined) //true
console.log('1' == 1) //true
console.log('1' == true) //true true会转成1
console.log('2' == true) //false
console.log([] == false) //true
console.log([] == []) // false
console.log([] == ![]) //true


