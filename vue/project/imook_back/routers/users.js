const express = require('express') ;
const router = express.Router() ;
const Users = require('../models/Users') ;

//统一返回格式
var resData ;
router.use((req,res,next)=>{
    resData = {
        code : 0 ,
        message : ''
    };
    next() ;
});

//登录
router.post('/login',(req,res,next)=>{
    let user_name = req.body.user_name ;
    let user_password = req.body.user_password ;

    Users.findOne({user_name,user_password}).then(userInfo=>{
        if(!userInfo){
            resData.code = 2 ;
            resData.message = '用户名不存在或者密码错误' ;
            res.json(resData) ;
            return ;
        }
        resData.message = '登录成功' ;
        resData.userInfo = {
          user_id : userInfo.user_id ,
          user_name: userInfo.user_name
        };
        res.cookie("userInfo",JSON.stringify(resData.userInfo),{path:'/',maxAge:1000*60*60}) ;
        // req.session.user = userInfo ; //cookie可被伪造，用session安全，需要安装express-session
        res.json(resData) ;
    })

}) ;

//查询当前用户购物车数据
router.get("/cartList",(req,res,next)=>{

    let user_id = JSON.parse(req.cookies.userInfo).user_id ;
    Users.findOne({user_id}).then(userInfo=>{
        // console.log(userInfo) ;
        resData.message = '获取用户购物车数据成功' ;
        resData.cartList = userInfo.cart_list;
        res.json(resData) ;
    })
})

module.exports = router 