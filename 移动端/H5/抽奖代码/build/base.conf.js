
var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') ;
const resolve = require('./resolve');

const prodMode = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
const pureProdMode = process.env.NODE_ENV === 'production'

console.log(__dirname)

module.exports = {
    // watch:true,
    entry: './src/js/index.js',
    output: {
        filename:'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve,
    plugins:[
        new MiniCssExtractPlugin({
            filename: "index.css"
        })
    ],
    module: {
        rules: [
            { test: require.resolve("jquery"), loader: "expose-loader?$" },
            {
                test: /\.css$/,
                use: [
                    'style-loader',//把写的css当做style标签插到head里面
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: path.resolve(process.cwd(), "src"),
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { legacy: true }], //处理装饰器等
                        ["@babel/plugin-proposal-class-properties", { loose: true }],
                        "@babel/plugin-transform-runtime", //处理async等
                        "@babel/plugin-syntax-dynamic-import"
                    ]
                },
            },
            { 
                test:/\.(png|jpg|gif|svg|bmp)/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit: 5*1024 , //小于5k的用url-loader生成base64直接嵌入html
                        outputPath: 'img/',
                    }
                }
            },
        ]
    },
};
