/**
 * 希望某些时候，只要包含其中一些规则即可
 *  1）可选?
 *  2）as 断言
 *  3）先赋值给一个变量
 */

 interface Options {
     width: number ,
     height: number ,
     color: string
 }
 fn({ //一般情况
    height:200 ,
    width: 100 ,
    color: 'red'
 })

 function fn(opts:Options){//告知ts断言它是Options类

 }

 fn({ //as断言
     height:200 ,
     width: 100
 } as Options ) 

let obj = { //先放在对象里面，多声明的a就不会报错，绕开了类型检测
    height:200 ,
    width: 100 ,
    color: 'red' ,
    a: 1
 }

 fn( obj)


