/**
 * 增强对象字面量
 * 作用：缩减代码
 */
 function createBookShop(inventory){
    return {
        //inventory : inventory , 
        inventory , //简化上面的写法
        // inventoryValue : function() {
        //     return this.inventory.reduce( (total , book) => total + book.price , 0 ) ;
        // },
        inventoryValue() {  //简化上面的写法 返回所有价格总和
            return this.inventory.reduce( (total , book) => total + book.price , 0 ) ;
        },
        priceForTitle(title){ //返回对应书名的price
            return this.inventory.find( book => book.title === title ).price ;
        }
    }
 }

 const inventory = [
     {title:"Vue" , price : 10},
     {title:"Angular" , price : 15}
 ]

 const bookShop = createBookShop(inventory) ;

 //console.log(bookShop.inventoryValue()) ; //25
 //console.log(bookShop.priceForTitle("Angular")) ; //15

 function saveFile(url,data){
    $.ajax({
        url ,
        data ,
        method : "POST",
    })
 }

 const url = "http://fileupload.com" ;
 const data = {color:"red"} ;

 saveFile(url,data) ;