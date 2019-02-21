/**
 * 希望规则是：一组由数字进行key命名的对象
 * 如果一个一个的定就很僵硬
 */

 interface MyArray{
    [attr:number]:any //定义了key是number类型，值可以是任意的类型
    length: number //再加个这个就像个类数组对象的定义了
 }

 function fn(opt:MyArray){

 }

 fn({
     0: 22,
     length:1
 }) ;