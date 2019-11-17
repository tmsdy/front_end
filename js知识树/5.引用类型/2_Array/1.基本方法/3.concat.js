var arr1 = [ 1,2,3 ];
var arr2 = [ 4,5,6 ];
var arr3 = [ 7,8,9 ];

console.log( arr1.concat( arr2, arr3 ) ); //1,2,3,4,5,6,7,8,9
console.log(arr1.concat(4,5,6))  //1,2,3,4,5,6
console.log(arr1.concat([4,5,6])) //1,2,3,4,5,6