const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/main.js', // 从入口开始，可以单入口、多入口
    output: { // 输出的相关配置
        path: path.join(__dirname, 'dist'), //输出的文件夹，只能是绝对路径 
        //name是entry名字默认是main,hash根据打包后的文件内容计算出来的一个hash值
        filename: '[name].[hash:8].js' //打包后的文件名
    },
    Module: { // 配置模块转换规则，webpack一切皆模块，一个模块对应一个文件
        rules: [
            {
                test: /\.css$/,
                // loader从右向左顺序解析
                use: ['cache-loader', 'vue-style-loader', 'css-loader', 'postcss-loader']
            },
        ]
    },
    plugins: [ // 插件，可以在webpack构建流程中任意时机注入扩展逻辑，想做啥做啥。
        new HtmlWebpackPlugin({
            template: './src/index.html',// 模版
            filename: 'index.html',// 产出的html名
        }),
    ],
}
/*
* Chunk：代码块，由多个模块组合而成，用于代码合并和分割


*/