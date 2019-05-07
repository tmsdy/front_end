// instanceof 检查构造函数的原型是否在对象的原型链上。

function Parent(name){
    this.name = name ;
    this.colors = ["red","blue","green"] ;
}
Parent.prototype.sayName = function(){
    console.log(this.name) ;
}
function Son(name,age){ 
    Parent.call(this,name) ; 
    this.age = age ;
}
//原型继承继承构造函数的原型对象
Son.prototype = new Parent() ;
Son.prototype.constructor = Son ;//修复构造函数指向(其实改不改都行)

Son.prototype.sayAge = function(){
    console.log(this.age) ;
}

let s = new Son('Tom');
console.log(s instanceof Son); // true
console.log(s instanceof Parent); // true
console.log(myInstanceof(s,Son)) //true
console.log(myInstanceof(s,Parent))

// instanceof 的内部机制
function myInstanceof(x,y){
    while(x.__proto__!==null) {
        if(x.__proto__===y.prototype) {
            return true;
            break;
        }
        x.__proto__ = x.__proto__.proto__;
    }
    if(x.__proto__==null) {return false;}
    return false
}