var express = require('express') 
var app = express() ;

app.get('/',(req,res,next)=>{
    res.json('三生三世')
})

app.get('/hello',(req,res,next)=>{
    res.json('hello')
})

app.listen(1234,()=>{
    console.log('服务器已启动')
})