let arr = [1,2,3,4] ;
/*
1.求和：
    1.val的初始值，默认是第一个item
    2.设初始值里面才能打印到数组第一项，否则从第二项开始
*/
let sum8 = arr.reduce((val,item,index,origin)=>{
    // console.log(item)
    return val+item
},5) 
// console.log(sum8)
// 2.求平均值
let average = arr.reduce((val,item,index,origin)=>{ //index是每次的索引，origin是原数组
    let sum = val + item ;
    if(index == origin.length-1){
        return Math.round(sum/origin.length) ;
    }else{
        return sum
    }
})
// console.log(average)

// reduce是从左往右算，reduceRight是从右往左算

//reduce的实现(有问题)
Array.prototype.reduce2 = function(reducer,initialVal=(this[0]||0)){
    for(let i=0 ;i<this.length ;i++){
        initialVal = reducer(initialVal,this[i],index=i,origin=this)
    }
    return initialVal
}
console.log(arr)
let sum2 = arr.reduce2((val,item,index,origin)=>{
    console.log(item)
    return val + item ;
}) // 为什么是 1 2 3 4 11
// },5)
console.log(sum2)