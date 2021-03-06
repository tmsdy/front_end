/*

*1.const声明必须同时赋值，否则会报错,修改值也会报错。一般是用const声明，如果变量会改变的则用let声明

const x = 10 ;
x = 100 ; //报错 常量不能改变其值

*2.复合类型const变量保存的是引用。因为复合类型的常量不指向数据，而是指向数据(heap)所在的地址(stack)
所以通过 const 声明的复合类型只能保证其地址引用不变，但不能保证其数据不变。

const colors = [] ;
colors.push ("red") ; //可以的
colors.push ("blue") ;
colors = ['green'] ;//报错，不能改地址

console.log(colors) ;

*3.在函数内访问下面const定义的函数可以的，在{...params}不能用下面const定义的params

*/