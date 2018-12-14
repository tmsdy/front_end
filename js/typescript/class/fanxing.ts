// 在大型项目里面能体现优势
class Calc<T>{
    a:T ;
    b:T ;
    constructor(a,b){
        this.a = a ;
        this.b = b ;
    }

    show(c:T){
        // console.log(this.a+this.b+c) ; //因为T可能是别的类型，不一定适用这个+号
        console.log(this.a) ;
        console.log(this.b) ;
        console.log(c) ;
    }
}

var obj = new Calc<number>(5,6) ; //这个number去代替T的类型，如果不写默认any

obj.show(7) ;


/*
Array：其实它是靠泛型实现的
interface Array<T>{
    reverse(): T[] ;
    sort(compare?:(a:T,b:T)=>number):T[] ;
    ...
}
数组最完整的写法：
var arr:Array<number> = new Array<number>() ;

*/