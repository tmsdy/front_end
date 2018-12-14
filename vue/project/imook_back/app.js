const express = require('express');
const swig = require('swig') ;
const app = express();

app.use('/public',express.static(__dirname+'/public')) ;//设置静态文件托管
app.engine('html',swig.renderFile) //第一个参数是模板引擎的名称(也是后缀)，第二个参数是解析处理模板内容的方法
app.set('views','./views') ;//设置模板文件存放的目录，一参必须是views，二参是目录
app.set('view engine','html') ;//注册的模板引擎，一参必须view engine，二参同上面的一参
swig.setDefaults({cache:false}) ;//取消缓存，这样能刷新看效果

const bodyParser = require('body-parser') ;//解码
app.use(bodyParser.urlencoded({extend:true})) ;
app.use(bodyParser.json()) ;

const cookieParser = require('cookie-parser') ;//用cookie
app.use(cookieParser()) ;

app.use((req,res,next)=>{ //跳转拦截(放上面)
    if(req.cookies.userInfo){
        next() ;
    }else{
        // console.log(req.path) //不包括后面参数的路径
        if(req.path == '/goods/addCart'){//拦截的黑名单
            res.json({
                status:'10001',
                msg:'请登录后再操作'
            })
        }else{
            next() ;
        }
    }
})

// app.use('/',require('./routers/index')) ;
app.use('/users',require('./routers/users')) ;
app.use('/goods',require('./routers/goods')) ;



  //链接数据库并监听hhtp端口
const mongoose =require('mongoose') ;
mongoose.connect('mongodb://localhost:27017/mall',(err)=>{
    if(err){
        console.log("数据库链接失败！")
    }else{
        console.log("数据库链接成功！") ;
        app.listen(7777) ;
    }
}) ;


