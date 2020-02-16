
/*
具体看书

*null: 定义了但是值为空,强调的是没有这个值
    1）null是js的关键字，可以用null来获取null值。一般让我们声明某个变量是没有值的
    2) typeof null -> object
    3）是一个对象(空对象, 没有任何属性和方法)，作为函数的参数，表示该函数的参数不是对象
    4) 可以将某个引用类型赋值null，释放引用防止内存泄漏。

*undefined：表示一个变量声明了没有初始化(赋值)，它的类型只有一个值，就是 undefined，强调的是没有定义。
    1）js让任何变量在赋值前是 Undefined 类型、值为 undefined。
    2）js的undefined是个变量并非关键字(设计失误之一)，一般用void 0 获取undefined值
    3）typeof undefined -> undefined
    4)

区分null 和　undefined要用 ===
null == undefined // true
null === undefined // false

*/