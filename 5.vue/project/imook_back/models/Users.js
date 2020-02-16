var mongoose = require('mongoose') ;

let users_schema = new mongoose.Schema({

    user_id : String ,
    user_name : String ,
    user_password : String ,
    order_list : Array ,
    cart_list:[
        {
            productId: String ,
            productName: String ,
            productPrice: String ,
            productImg: String ,
            checked:Boolean,
            productNum:Number
        }
    ],
    address_list:Array

});

module.exports = mongoose.model('Users',users_schema) ;