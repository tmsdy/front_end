const path = require('path') ;

module.exports = {
    entry :{
    } ,
    output :{
    },
    module:{
        rules:[
            
        ]
    },
    plugins:[ 
    ],
    devServer:{
        host:'localhost',
        port:8080,
        compress:true,//服务器返回给浏览器的时候是否启用gzip压缩
    }
}