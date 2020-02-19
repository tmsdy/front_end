var http = require('http') ;

var server = http.createServer(function (req,res) {
    console.log("客户端想服务器发送请求："+req.url) ;
    res.writeHead(200,{"Content-type":"text/plain"}) ;
    res.end("Server is working") ;
});

server.listen(8888,'127.0.0.1') ;

console.log("Server is running") ;