const http = require('http') ;
const fs = require('fs') ;

const zlib = require('zlib') ;

http.createServer((req,res)=>{
    // const html = fs.readFileSync('gzip.html','utf-8') ;
    const html = fs.readFileSync('gzip.html') ;// 不能用utf-8要默认的buffer
    res.writeHead(200,{
        'Content-Type': 'text/html' ,
        'Content-Encoding':'gzip'
    })
    res.end(zlib.gzipSync(html)) ;
    // res.end(html) ;
}).listen(7777) ;

console.log('服务在运行')