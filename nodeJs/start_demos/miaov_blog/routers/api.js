var express = require('express') ;
var router = express.Router() ;
var User = require('../models/User') ;
var Content = require('../models/Content') ;

//统一返回格式
var resData ;
router.use((req,res,next)=>{
    resData = {
        code : 0 ,
        message : ''
    };
    next() ;
});
/*
* 用户注册
*   注册逻辑
*   1.用户名和密码不能为空
*   2.两次输入密码必须一致
*   3.用户是否已经被注册(数据库查询)
* */
//注册验证
router.post('/user/register',(req,res,next)=>{
    let username = req.body.username ;
    let password = req.body.password ;
    let repassword = req.body.repassword ;
    if(username==''||password==''){
        resData.code=1 ;
        resData.message='用户名或密码不能为空！' ;
        res.json(resData) ;
        return ;
    }
    if(password != repassword){
        resData.code=2 ;
        resData.message='两次输入的密码不一致！' ;
        res.json(resData) ;
        return ;
    }
    //检测用户名是否注册过
    User.findOne({username}).then(( userInfo )=>{
        if(userInfo){
            resData.code = 3 ;
            resData.message = '用户名已经被注册了' ;
            res.json(resData) ;
            return ;
        }
        //保存用户注册信息到数据库中
        let user = new User({username, password}) ;//实际工作中密码要加密的
        return user.save() ;
    }).then((newUserInfo)=>{
        resData.message = '注册成功' ;
        res.json(resData) ;
    });

});
//登录验证
router.post('/user/login',(req,res)=>{
    let username = req.body.username ;
    let password = req.body.password ;
    if(username==''||password==''){
        resData.code=1 ;
        resData.message='用户名或密码不能为空！' ;
        res.json(resData) ;
        return ;
    }
    User.findOne({username, password}).then(( userInfo )=>{
        if(!userInfo){
            resData.code = 2 ;
            resData.message = '用户名不存在或者密码错误' ;
            res.json(resData) ;
            return ;
        }
        resData.message = '登录成功' ;
        resData.userInfo = {
          _id : userInfo._id ,
          username: userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id : userInfo._id ,
            username: userInfo.username
        })) ;
        res.json(resData) ;
        return ;
    })
});
//退出
router.get('/user/logout',(req,res)=>{
    req.cookies.set('userInfo',null) ;
    res.json(resData) ;
});

//获取指定文章的所有评论
router.get('/comment',(req,res)=>{
    let contentId = req.query.contentid || '' ;
    Content.findOne({_id:contentId}).then(content=>{
        resData.data = content.comments ;
        res.json(resData) ;
    });
});

//评论
router.post('/comment/post',(req,res)=>{
    let contentId = req.body.contentid || '' ;
    let postData = {
        username : req.userInfo.username ,
        postTime : new Date() ,
        content : req.body.content
    };
    Content.findOne({_id:contentId}).then(content=>{
        content.comments.push(postData) ;
        return content.save() ;
    }).then((newContent)=>{
        resData.message = '评论成功' ;
        resData.data = newContent ;
        res.json(resData) ;
    });

});

module.exports = router ;