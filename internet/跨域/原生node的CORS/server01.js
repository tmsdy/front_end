const http = require('http')
const fs = require('fs')

http.createServer((req,res)=>{
    console.log(req.url) ;

    const html = fs.readFileSync('test.html','utf-8') ;
    res.writeHead(200,{
        'Content-Type':'text/html'
    })
    res.end(html) ;

}).listen(8888)