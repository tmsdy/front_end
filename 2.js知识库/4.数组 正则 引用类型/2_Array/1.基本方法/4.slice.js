var arr = [1,2,3,4,5,6] ;

console.log(arr.slice(2)) ; //截取索引为2后面所有[3,4,5,6]
console.log(arr.slice(-2)) ; //截取最后2个[5,6]
console.log(arr.slice(-5)) ; //截取最后五个[2,3,4,5,6]
console.log(arr.slice(5)) ; //截取索引为5后面所有[6]

console.log(arr.slice(1,3)); //截取1到3的，包前不包后原则

