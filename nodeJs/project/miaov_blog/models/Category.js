let mongoose =require('mongoose') ;
//分类的表结构
let  categories_schema = new mongoose.Schema({
        name : String ,//分类名称
    });

module.exports = mongoose.model('Category',categories_schema) ;