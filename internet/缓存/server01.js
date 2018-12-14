const http = require('http')
const fs = require('fs')

http.createServer((req,res)=>{
    console.log(req.url)
    if (req.url ==='/'){
        const html = fs.readFileSync('test01.html','utf-8') ;
        res.writeHead(200,{
            'Content-Type':'text/html'
        })
        res.end(html) ;
    }

    if (req.url === '/script.js' ){
        res.writeHead(200,{
            'Content-Type': 'text/javascript',
            'Cache-Control': 'max-age=200,public'
        })
        res.end('console.log("script loaded twice")')
    }

}).listen(8888,()=>{
    console.log('服务已启动')
})