/**
 * 类接口：使用接口让某个类去符合某种契约
 * 1）implements某个接口的类必须实现这个接口中确定所有的内容
 * 2）一个类只能有一个父类，但是可以implements多个接口
 */
interface ISuper{ //成为超人的接口
    fly():void ;

}

 class Man {

    constructor(public name:string){
        this.name = name ;
    }

 }

 class SuperMan extends Man implements ISuper{ //可以实现多个接口，必须把这些接口的特征也都实现
    fly(){
        console.log('飞翔')
    }
 }

 let huihui = new SuperMan('灰灰') ;

 if(huihui instanceof SuperMan){

 }