const express = require('express') ;
const swig = require('swig') ;

const app = express() ;
//设置静态文件托管，当访问url已/public开始，name直接返回对应__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public')) ;

app.engine('html',swig.renderFile) ;//第一个参数是模板引擎的名称(也是后缀)，第二个参数是解析处理模板内容的方法
app.set('views','./views') ;//设置模板文件存放的目录，一参必须是views，二参是目录
app.set('view engine','html') ;//注册的模板引擎，一参必须view engine，二参同上面的一参
swig.setDefaults({cache:false}) ;//取消缓存，这样能刷新看效果

const bodyParser = require('body-parser') ;//解码
app.use(bodyParser.urlencoded({extend:true})) ;

const Cookies = require('cookies') ;
const User = require('./models/User') ;

app.use((req,res,next)=>{ //每次访问页面解析cookies信息
    req.cookies = new Cookies(req,res) ;
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo')) ;
            User.findById(req.userInfo._id).then((userInfo)=>{ //判断是不是管理员
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin) ;
                next() ;
            })
        }catch(e){
            // next() ;
        }
    }else {
        next() ;
    }

});

//划分功能模块
app.use('/admin',require('./routers/admin')) ;
app.use('/api',require('./routers/api')) ;
app.use('/',require('./routers/main')) ;

//链接数据库并监听hhtp端口
const mongoose =require('mongoose') ;
mongoose.connect('mongodb://localhost:27017/blog',(err)=>{
    if(err){
        console.log("数据库链接失败！")
    }else{
        console.log("数据库链接成功！") ;
        app.listen(8081) ;
    }
}) ;


