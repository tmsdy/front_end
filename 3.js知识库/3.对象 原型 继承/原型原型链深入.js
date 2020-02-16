/*
参考：https://mp.weixin.qq.com/s/fMvSims4VBeoKs0JJhJYtA
* 1.所有的对象都有__proto__指针，

* 2.原型链查找: person1实例->__proto__(Person.prototype)->__proto__(Object.prototype)->__proto__(null)
只沿着__proto__和prototype找，不走constructor。
特例：当把构造函数当成Function的实例对象的时候，走构造函数的__proto__到Function的原型

/*
    *例1: var obj={}; obj.prototype.__proto__指向谁?
    obj.prototype是undefined，函数对象才有prototype，所以答案是 js报错
*/

// * 3.person是没有constructor的，会走person.__proto__ -> Person.prototype(这里有constructor)
function Person() { }
var person = new Person();
console.log(person.constructor === Person); // true
console.log(person.constructor === Person.prototype.constructor) //true

/*

* 4.__proto__：绝大部分浏览器都支持这个非标准的方法访问原型，并非来自Person.prototype而是来自Object.prototype，它是一个 getter/setter
用obj.__proto__时相当于返回了Object.getPrototypeOf(obj)
设置obj.__proto__=xxx时相当于Object.setPrototypeOf(obj,xxx)

* 5.对象的 hasOwnProperty() 来检查对象自身中是否含有该属性
使用 in 检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回 true

*/