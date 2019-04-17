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
        const etag = req.headers['if-none-match'] ;
        if(etag ==='777'){
            // 返回304说明验证成功资源没修改可以读缓存，浏览器就直接去读缓存了 
            res.writeHead(304,{
                'Content-Type': 'text/javascript',
                'Cache-Control': 'max-age=200000,no-cache',
                'Last-Modified' : '123' ,
                'Etag' : '777'
            })
            res.end('123') //不会去读这里
        }else{
            res.writeHead(200,{
                'Content-Type': 'text/javascript',
                //设置no-cache每次拿缓存都需要先去服务端验证
                'Cache-Control': 'max-age=200000,no-cache',
                'Last-Modified' : '123' ,
                'Etag' : '777'
            })
            res.end('console.log("script loaded twice")')
        }
        
    }

}).listen(8889)