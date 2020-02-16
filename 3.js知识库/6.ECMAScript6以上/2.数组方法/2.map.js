/** map：映射返回一个数组，返回的数组还是同长度的
 * 优点：可以改变每个item的格式
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