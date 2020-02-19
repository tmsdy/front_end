const express = require('express') ;
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {videoList} = require('./models/videoList')

const app = express() ;
const port = 5000 ;

mongoose.connect("mongodb://localhost:27017/course_web",{useNewUrlParser: true})
    .then(()=>{
        console.log("正常连接数据库") ;
    })
    .catch(err=>{
        console.log(err) ;
    });
//引入模型并实例化
require("./models/Ideas") ;
const Idea = mongoose.model('ideas') ;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//配置路由
app.get('/',(req,res)=>{
    const title = "hello" ;
    res.render("index",{
        title:title,
    }) ;
});

app.get('/videoList',(req,res)=>{
    res.json(videoList);
})

app.get('/about',(req,res)=>{
    res.render("about") ;
});

app.get('/ideas/add',(req,res)=>{
    res.render("ideas/add") ;
});

app.post('/ideas',urlencodedParser,(req,res)=>{
    // console.log(req.body) ;
    let errors = [] ;
    if(!req.body.title){
        errors.push({text:"请输入标题！"})
    }
    if(!req.body.details){
        errors.push({text:"请输入详情！"})
    }
    if(errors.length){
        res.render('ideas/add',{errors,title:req.body.title,details:req.body.details}) ;
    }else{
        const newUser = {
            title :req.body.title ,
            details :req.body.details
        } ;
        new Idea(newUser)
            .save()
            .then(idea=>{
            res.redirect('/ideas') ;
        })
    }
});


app.listen(port,()=>{
    console.log(`Server is starting on ${port}`) ;
});