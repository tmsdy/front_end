
var s = "feifei" ;
var b = true ;
var i = 22 ;
var u;
var n = null ;
var o = new Object() ;
var arr = [1,2,3] ;
var re = /d+/ ;
var date = new Date();
var error = new Error();

// 1.typeof 能有效检测出是什么基本数据类型，所有引用类型都是object，typeof检测不出
console.log(typeof s) ; //string
console.log(typeof b) ; //boolean
console.log(typeof i) ; //number
console.log(typeof u) ; //undefined
console.log(typeof n) ; //object 
console.log(typeof o) ; //object

//2.instanceof 检查构造函数的原型是否在对象的原型链上。
console.log(n instanceof Object) ; //false
console.log(o instanceof Object) ; //true
console.log(arr instanceof Array) ; //true
console.log(re instanceof RegExp) ; //true
console.log(date instanceof Date) ; //true
console.log(error instanceof Error) ; //true

//3.Object.prototype.toString.call 很强，基本都能判断出来
console.log(Object.prototype.toString.call(u)) //[object Undefined]
console.log(Object.prototype.toString.call(n)) //[object Null]
console.log(Object.prototype.toString.call(s)) //[object String]
console.log(Object.prototype.toString.call(date)) //[object Date]
console.log(Object.prototype.toString.call(error)) //[object Error]