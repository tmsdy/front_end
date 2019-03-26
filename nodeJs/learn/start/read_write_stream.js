var fs = require('fs') ;
var http = require('http') ;

//读取文件流
// var my_read_stream = fs.createReadStream(__dirname+'/read_me.txt','utf-8') ;
//写入文件流
var my_write_stream = fs.createWriteStream(__dirname+'/write_me2.txt') ;

// my_read_stream.pipe(my_write_stream) ;//把读取到的my_read_stream写入my_write_stream

// my_read_stream.on('data',function (res) {
//     console.log('-------------------正在接收一部分数据-------------------------') ;
//     // console.log(res) ;//一部分一部分的读取
//     my_write_stream.write(res) ;//写入数据
// })

//搭建服务器
var server = http.createServer(function (req,res) {
    res.writeHead(200,{"Content-type":"text/plain"}) ;
    var my_read_stream = fs.createReadStream(__dirname+'/read_me.txt','utf-8') ;

    my_read_stream.pipe(res) ;//读取纯文本数据显示到页面上
});

server.listen(3000,'127.0.0.1');

console.log("Server is running") ;