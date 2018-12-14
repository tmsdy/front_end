// function show(a,b){ //没声明类型默认any
//     console.log(a+b) ;
// }
function show(a:number,b:number,c?:number):number{ //c是可传可不传,返回值是numder类型
    console.log(a+b) ;
    return a+b ;
}

show(1,2) ;//可以
// show('1',2) ;//不行

show(1) ;// 不行 参数数量不吻合(签名检查) 
show(1,2,3) ; //可以

//函数表达式
// let fn = function(x:number,y:number):number{
//     return x+y ;
// }

let fn2:(x:number,y:number)=>number = function(x:number,y:number):number{
    return x+y ;
}
fn2('1','2') ;//不行
fn2(1,2) ; //可以

