let express = require('express') ;
let app = express() ;
let whiteList = ['http://localhost:3000']

app.use((req,res,next)=>{
    let origin = req.headers.origin ;

    if(whiteList.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin',origin) ;
        res.setHeader('Access-Control-Allow-Headers','token') ;
        res.setHeader('Access-Control-Allow-Methods','PUT') ;
        res.setHeader('Access-Control-Allow-Credentials',true) ;
    
        // res.setHeader('Access-Control-Max-Age',100) ; //验证通过以后100s内不用再预请求
        res.setHeader('Access-Control-Expose-Headers','age') //对浏览器说自定义的请求头age是安全的
    }

    next() ;
})

app.get('/getData',(req,res)=>{
    console.log(req.headers) ;
    res.end('get数据')
})
app.post('/getData',(req,res)=>{
    res.end('post数据')
})
app.put('/getData',(req,res)=>{
    console.log(req.headers) ;
    res.setHeader('age',22) ;
    res.end('put数据')
})

app.listen(3333) ;