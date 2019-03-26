var fs = require('fs') ;
var http = require('http') ;

//搭建服务器
var server = http.createServer(function (req,res) {

    console.log("发送请求："+req.url) ; //会发送2次请求，一次是/，一次是favicon.ico

    if(req.url !== '/favicon.ico'){
        // res.writeHead(200,{"Content-type":"application/json"}) ;
        res.writeHead(200,{"Content-type":"text/html"}) ;
        var my_read_stream = fs.createReadStream(__dirname+'/index.html','utf-8') ;
        // var my_read_stream = fs.createReadStream(__dirname+'/person.json','utf-8') ;

        my_read_stream.pipe(res) ;//读取纯文本数据显示到页面上
    }

});

server.listen(3333,'127.0.0.1');

console.log("Server is running") ;