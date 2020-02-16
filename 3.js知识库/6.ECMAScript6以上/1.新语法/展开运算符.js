var defaultColors = ["red" , "green" ] ;
var favoriteColors = ["orange" , "yellow"] ;

console.log([...defaultColors , ...favoriteColors]) ; 

let arr = [1,2,3]
let max1 = Math.max(1,2,3) ;
let max2 = Math.max.apply(null,arr) ; //es5写法
let max3 = Math.max(...arr) ;

console.log(max1,max2,max3) //3 3 3 