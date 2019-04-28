//map方法 便于由一个数组来派生一个新的想要的数组

/**场景1
 * 假定有一个数值数组(A),将A数组中的值以双倍的形式放到B数组
 */
 var numbers = [1,2,3] ;
 var doubleNumbers = [] ;

 var doubled = numbers.map(num => num*2 ) ;
 //console.log(doubled) ; // [2,4,6]
 
// 2.
var cars = [
    { model : "AnTa" , price : "cheap" } ,
    { model : "BMW" , price : "expensive"} 
] ;

var prices = cars.map(function(car){
        return car.price ;
})
console.log(prices) ; //["cheap" , "expensive"]