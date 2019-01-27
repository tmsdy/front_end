const path = require('path') ;

module.exports = {
    entry :'./src/main.js',//从入口开始
    output :{
        path:path.join(__dirname,'dist') ,//输出的文件夹，只能是绝对路径
        filename: 'bundle.js', //打包后的文件名
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