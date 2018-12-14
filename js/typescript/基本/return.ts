
// function sum(a:number,b:number){ //默认隐式的返回number
//     return a+b ;
// }
function sum(a:number,b:number):number{ //显式声明返回number类型
    return a+b ; //可以
    // return 'abc' ;//不行要是number
}

console.log(sum(12,5)) ; //行

// console.log(sum())