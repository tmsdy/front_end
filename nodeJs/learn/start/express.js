var express  = require('express') ;
var app = express() ;

app.set('view engine','ejs') ;//配置视图引擎
app.use('/assets',express.static('assets')) ;//让服务器识别外部样式表(静态文件)

app.get('/',(req,res)=>{
    res.render('index') ;
});

app.get('/contact',function (req,res) {
    res.render('contact') ;
});

app.get('/profile',function (req,res) {
    var data = [{name:"feifei",age:21,habits:['game','sex']},{name:"fangfang",age:20,habits:['friends','family']}] ;
    res.render('profile',{text:"爱学习的呆子",data}) ;//会自动找到profile.ejs
});

//路由参数
app.get('/profile/:id',function (req,res) {
    res.send('This is profile page!路径参数为：'+req.params.id) ;
});

app.listen(3333) ;