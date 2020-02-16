var mongoose = require('mongoose') ;

let goods_schema = new mongoose.Schema({

    productId : String ,
    productName : String ,
    productPrice : Number ,
    productImg : String ,
    productNum : Number ,
    checked : Boolean
});

module.exports = mongoose.model('Goods',goods_schema) ;