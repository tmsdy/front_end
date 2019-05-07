/*
1.在 JS 中并不存在类，class和ES5的构造函数对应，是一种让写法更像面向对象编程的语法糖
*/
class Parent{
    constructor(name){
        this.name = name ;
    }
    static age = 22 // 静态属性是class本身的属性
    static hello(){ // 静态方法是属于类的，不会被实例继承，直接Parent.hello()来调用不需要实例化。
        console.log('hello')
    }
    getName(){
        console.log(this.name) 
    }
}

class Child extends Parent{
    constructor(name){
        this.name = name
    }
}

let p = new Parent('feifei') ;
p.getName() ;
Parent.hello() ;

let c = new Child('feifei')
console.log(c)
