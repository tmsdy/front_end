/*
1.在 JS 中并不存在类，class和ES5的构造函数对应，是一种让写法更像面向对象编程的语法糖

2.静态属性和方法是在类上的，不会被实例继承可以被子类继承，直接Parent.hello()来调用不需要实例化。
    在实例上和其原型链上找不到静态属性和方法的

3.实例属性方法是在函数的原型上，实例可以通过原型链找到，需要注意和构造函数创建不同的是这原型上的属性方法不可枚举

4.可以定义构造函数constructor，创建类的实例时候就会调用构造函数

*/
class Parent{
    constructor(name){
        this.name = name ; //实例的私有属性
    }
    static age = 22
    static hello(){
        console.log('hello')
    }
    getName(){ //实例属性方法，会被继承。相当于原型上的属性
        console.log(this.name)

    }
}
/*
    子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其进行加工。
    如果不调用 super 方法，子类就得不到 this 对象。也正是因为这个原因，在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。
*/
class Child extends Parent{
    constructor(name,age){
        super(name); // 调用父类的 constructor(name),相当于 ES5 的 Parent.call(this)。
        this.age = age
    }
}

let p = new Parent('feifei') ;
p.getName() ;
Parent.hello() ; // hello
p.hello() // p.hello is not a function


let c = new Child('feifei')
// console.log(c)
