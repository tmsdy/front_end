var fs = require('fs') ;
var http = require('http') ;

//搭建服务器
var server = http.createServer(function (req,res) {

    if(req.url !== '/favicon.ico'){

        if(req.url ==='/home' || req.url ==='/'){
            res.writeHead(200,{"Content-type":"text/html"}) ;
            fs.createReadStream(__dirname+'/index.html').pipe(res) ;
        }else if(req.url === '/contact'){
            res.writeHead(200,{"Content-type":"text/html"}) ;
            fs.createReadStream(__dirname+'/contact.html').pipe(res) ;
        }else if(req.url === '/data'){
            var data = [{name : 'feifei' , age :21}, {name : 'fangfang' , age : 20}] ;
            res.writeHead(200,{"Content-type":"application/json"}) ;
            res.end(JSON.stringify(data)) ;
        }
    }

});

server.listen(3333,'127.0.0.1');

console.log("Server is running") ;