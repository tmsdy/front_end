
/*
具体看书

null: 定义了但是值为空
    1）null是js的关键字，可以放心用null来获取null值。一般让我们声明某个变量是没有值的
    2) typeof null -> object
    3）是一个对象(空对象, 没有任何属性和方法)，作为函数的参数，表示该函数的参数不是对象

undefined：表示一个变量声明了没有初始化(赋值)，表示未定义，它的类型只有一个值，就是 undefined
    1）js让任何变量在赋值前是 Undefined 类型、值为 undefined。
    2）js的undefined是个变量并非关键字(设计失误之一)，一般用void 0 获取undefined值
    3）typeof undefined -> undefined
    4) 

null == undefined // true
null === undefined // false
    注意：
        在验证null时，一定要使用　=== ，因为 == 无法分别 null 和　undefined
        
再来一个例子：
    null
        Q：有张三这个人么？
        A：有！
        Q：张三有房子么？
        A：没有！
    undefined
        Q：有张三这个人么？
        A：有！
        Q: 张三有多少岁？
        A: 不知道（没有被告诉）
*/