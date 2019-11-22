/*

基本类型值：undefined,null,boolean,number,string
    - 按值访问，可以直接改变目标值。
    - 存在栈中

引用类型值：Object Symbol(ES6)
    - 按引用访问，js不允许直接操作内存地址，可以操作对象的引用
    - 对象存在栈中，它的引用指向堆中的内存地址。以key-value存在
    {
        key: myObj,
        value: ...(myObj的引用地址)
    }

*/
