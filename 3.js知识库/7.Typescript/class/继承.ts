
class Person{

    // 在构造函数的参数中如果直接使用public等修饰符，则等同于同时创建了该属性
    constructor(public name:string,public age:number){
        this.name = name ;
        this.age = age ;
    }
    

}

class Student extends Person{

    //如果手动重写了构造函数，需要手动调用父类构造函数。没重写则直接用父类的
    constructor(name:string,age:number,public type:string){
        super(name,age) ;//调用父类构造函数
        this.type = type ;
    }
    //子类可以访问父类的public,protected，不能访问private 

}

let s1 = new Student('feifei',30,'javascript') ;
