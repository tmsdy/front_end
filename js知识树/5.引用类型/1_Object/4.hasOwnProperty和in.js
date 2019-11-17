    // in操作符单独使用时，不管属性在对象的实例还是原型中都能返回true
    //obj.hasOwnProperty()，当属性在实例上返回true,在原型上返回false
    function Person(){} ;
    Person.prototype.name = "feifei" ;
    Person.prototype.age = 23 ;
    Person.prototype.sayName = ()=>{
        console.log(this.name) ;
    }

    let person1 = new Person() ;

    console.log(person1.hasOwnProperty("name")) ;//false
    console.log("name" in person1) ;//true

    person1.name = "fangfang" ;
    console.log(person1.hasOwnProperty("name")) ;//true
    console.log("name" in person1) ;//true

    delete person1.name ;
    console.log(person1.hasOwnProperty("name")) ;//false
    console.log("name" in person1) ;//true

    console.log('********************************************')
    //封装一个对象的原型里有属性才true的方法
    function hasPrototypeProperty(obj,name){
        return !obj.hasOwnProperty(name) && (name in obj) ; //右边确定有，左边确定不在实例上，都满足才行
    }
    let person2 = new Person() ;
    console.log(hasPrototypeProperty(person2,"name"))  ; //true
    person2.name = "fanfan" ;
    console.log(hasPrototypeProperty(person2,"name"))  ; //false