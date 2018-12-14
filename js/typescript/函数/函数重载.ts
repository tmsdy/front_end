// 函数重载：用同名函数实现不同功能 名称相同，但参数个数、类型、顺序不同。与返回值无关

function fn(x:number,y:number):number ; //定义函数格式
function fn(x:string,y:string):string ;

function fn(x:any,y:any):any{//函数的具体实现
  return x+y ;
}

fn(1,2) ; //可以

fn('a','b') ; //也行