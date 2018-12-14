/*
public  公有  任何人都可以访问
private   私有   只有类内部可以访问
protected   受保护    只有子类可以访问
方便做大型项目，符合类的最小化原则
    
 */

class Person{
    public name:string ; //默认是public
    private _age:number ; //私有化age方便自己设置规则，只有符合规则才能设置成功

    getAge():number{ //专门写个方法来访问age
        return this.age ;
    }

    setAge(age:number):void{ 
        if(age>0&&age<150){
            this._age = age ;
        }
    }
//存取器，这个a并不会作为方法，而是属性去访问。有点像计算属性
    get age():number{ 
        return this._age
    }
    set age(age:number){
        if(age>0&&age<150){
            this._age = age ;
        }
    }
}

var p  =new Person() ;

// p.age = 22 ; //它是私有的不给访问
p.getAge() ;

p.setAge(20) ;
p.setAge(200) ;

p.age ;
