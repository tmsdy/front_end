/*
1.ts的中的类，成员属性必须要声明后使用，是在class内，构造函数和方法外声明的
2.
*/

class Person{
    name:string ;//成员属性
    age:number ;

    constructor(name:string,age:number){//构造器
        this.name = name ;
        this.age = age ;
    }

    showMe(){ //成员方法
        console.log(this.name,this.age) ;
    }
}

var p = new Person('feifei',22) ;

p.showMe() ;