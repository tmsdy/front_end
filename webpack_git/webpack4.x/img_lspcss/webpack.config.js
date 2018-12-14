const path = require('path') ;
const CleanWebpackPlugin = require('clean-webpack-plugin') ;
const HtmlWebpackPlugin = require('html-webpack-plugin') ;
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') ;
let cssExtract = new ExtractTextWebpackPlugin('css/css.css') ;
let lessExtract = new ExtractTextWebpackPlugin('css/less.css') ;
let sassExtract = new ExtractTextWebpackPlugin('css/sass.css') ;

module.exports = {
    //先找到每个入口，然后从各个入口分别出发，找到依赖的模块，然后生成一个Chunk，把Chunk写到文件系统中(Assets)
    entry :'./src/main.js',
    output :{
        path:path.join(__dirname,'dist') ,//输出的文件夹，只能是绝对路径
        filename: '[name].[hash:8].js', //打包后的文件名
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                loader:cssExtract.extract({
                    use:['css-loader','postcss-loader']
                })
            },
            {
                test:/\.less$/,
                loader:lessExtract.extract({
                    use:['css-loader','less-loader']
                })
            },
            {
                test:/\.scss$/,
                loader:sassExtract.extract({
                    use:['css-loader','sass-loader']
                })
            },
            { //file-loader解析图片地址，把图片从源位置拷贝到目标位置并且修改原引用地址
                test:/\.(png|jpg|gif|svg|bmp)/,
                use:{
                    loader:'url-loader',
                    
                    options:{
                        limit: 9*1024 , //小于9k的用url-loader生成base64直接嵌入html中减少http请求
                        outputPath: 'images/'
                    }
                }
            },
            {
                test:/\.(html|htm)/,
                loader:'html-withimg-loader'
            }
        ]
    },
    plugins:[ // 插件放的位置不分顺序
        new CleanWebpackPlugin([path.join(__dirname,'dist')])  ,
        new HtmlWebpackPlugin({
            template:'./src/index.html',//模板
            filename:'index.html' ,//产出的HTML文件名
            hash:true, //会在引入的js里加入查询字符串避免缓存
            minify:{ //压缩静态文件 删除属性的双引号
                removeAttributeQuotes:true
            }
        }),
        cssExtract,
        lessExtract,
        sassExtract
    ],
    // 配置此静态文件服务器，可以用来预览打包后的项目
    devServer:{
        contentBase:'./dist' ,//静态资源根目录
        host:'localhost',
        port:8080,
        compress:true,//服务器返回给浏览器的时候是否启用gzip压缩
    }
}