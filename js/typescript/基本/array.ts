//一般声明数组
let arr1:number[] ;
arr1.push(1) ;
arr1.push('1') ; //有问题

//泛型
let arr2:Array<number> ;
arr2.push(1) ;
arr2.push('1') ; //有问题

let arr3:Array<number|string> ;
arr3.push(1) ;
arr3.push('1') ; //正常