/**
 * 抽象类：
 * 学生类和老师类有相同的地方有不同的地方，可以抽象一个人的类，把他们公共的地方抽出来。然后再继承一下就行了
 */
abstract class Person{ //定义为抽象类，不能够实例化(不能new出来)
    username:string ;

    constructor(username){
        this.username = username ;
    }

    say(){
        console.log('会说话呀')
    }
    abstract study():void ; //study具体在子类实现，可以定为抽象方法，抽象方法必须在抽象类中
}
// 如果一个类继承了抽象父类，则必须实现所有父类的抽象方法，否则此类得也是抽象类
class Student extends Person{ 
    
    study(){
        console.log('学生的学习方法')
    }

}

class Teacher extends Person{
    
    study(){
        console.log('老师的学习方法')
    }

}