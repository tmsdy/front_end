/** filter：根据条件返回一个数组
 * 优点：可以筛掉不想要的item
 */
var products = [
    {name:"cucumber",type:"vegetable",quantity:0 , price:1 } ,
    {name:"banana",type:"fruit",quantity:10 , price:15} ,
    {name:"celery",type:"vegetable",quantity:30 , price:8} ,
    {name:"orange",type:"fruit",quantity:3 , price:6} 
] ;

products = products.filter(function(product){
    return product.type === "vegetable"
    && product.quantity > 0
    && product.price < 10
})
//console.log(products) ;