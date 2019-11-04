/*
1.找对象的属性和方法: person1实例->__proto__(Person.prototype)->__proto__(Object.prototype)->__proto__(null)
当把构造函数当成Function的实例对象的时候，走构造函数的__proto__到Function的原型（一般不会走这里）

2.函数有prototype原型对象和__proto__指针，所有对象都有__proto__指针(除了null和undefined)

3.var obj={}; obj.prototype.__proto__指向谁?
obj.prototype是undefined，函数对象才有prototype
undefined.proto指向什么，所有的对象obj都具有proto属性(null和undefined除外)!所以答案是 js报错
*/
function Person() {
}
var person = new Person();
console.log(person.constructor === Person); // true
/*
4.当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，
会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性，所以：
*/
console.log(person.constructor === Person.prototype.constructor) //true
/*
5.__proto__ : 绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype ，
与其说是一个属性，不如说是一个 getter/setter，当使用 obj.__proto__ 时，可以理解成返回了 Object.getPrototypeOf(obj)。
*/