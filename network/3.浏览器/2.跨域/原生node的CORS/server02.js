const http = require('http')
const fs = require('fs')
// CORS 官方推荐方案
http.createServer((req, res) => {
    res.writeHead(200, {
        //服务端设置这个可以解决大部分跨域，*号里面放允许跨域请求的地址
        // 'Access-Control-Allow-Origin':'http://127.0.0.1:8888' ,

        // 虽然允许了所有请求地址，但是请求头是不被允许的,会OPTIONS预请求验证，验证成功才会再去请求,失败就报错
        // 跨域只允许方法 GET、HEAD、POST ，非简单请求都会发一次预检请求
        // 只允许请求头 text/plain、multipart/form-data、application/x-www-form-urlencoded
        'Access-Control-Allow-Origin': '*',
        //允许别的请求头
        'Access-Control-Allow-Headers': 'X-Test-Cors',
        //允许别的请求方法
        'Access-Control-Allow-Methods': 'PUT,Delete,POST',
        //1s验证通过以后就不需要再预请求了
        'Access-Control-Max-Age': '1000'
    })
    res.end('123')

}).listen(8887)

// withCredentials: true 前端请求得设置这个才能跨域发送cookie