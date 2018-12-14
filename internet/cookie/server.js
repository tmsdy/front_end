const http = require('http') ;
const fs = require('fs') ;

http.createServer((req,res)=>{
    console.log(req.url) ;

    const host = req.headers.host ;
    if (req.url === '/'){
        const html = fs.readFileSync('cookie.html','utf8') ;
        res.writeHead(200,{
            'Content-Type':'text.html',
            'Set-Cookie':['id=123;max-age=2','name=feifei;HttpOnly']
        })
        res.end(html) ;
        // 1.max-age(多长)和expires(什么时候过期)设置过期时间
        // 2.Secure只在https的时候发送
        // 3.HttpOnly无法通过document.cookie访问(安全性)
    }

}).listen(8888) ;

console.log('服务在运行')