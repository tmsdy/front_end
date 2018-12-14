
let mongoose =require('mongoose') ;
//用户的表结构
let users_schema = new mongoose.Schema({

    username : String ,//用户名
    password : String ,//密码
    isAdmin : { //是否是管理员
        type: Boolean ,
        default : false
    }

});
module.exports = mongoose.model('User',users_schema) ;