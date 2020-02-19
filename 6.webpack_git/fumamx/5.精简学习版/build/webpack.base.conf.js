const path = require('path')
const {
    resolve,
    assetsPath,
    genHappyPacks,
    createLintingRule
} = require('./utils')
const { VueLoaderPlugin } = require('vue-loader');
const config = require('../config')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: ['@babel/polyfill', './src/main.js'],
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
        }
    },
    module: {
        noParse: function (content) { // 不去解析依赖
            return /jquery|lodash|underscore/.test(content);
        },
        rules: [
            ...(isProd ? [] : [createLintingRule()]),
            {
                test: /\.css$/,
                use: ['cache-loader', 'vue-style-loader', 'css-loader', 'postcss-loader']
                // 加了cache-loader，OptmizeCssAssetsWebpackPlugin时间 23s -> 13s
            },
            {
                test: /\.vue$/,
                // loader: 'vue-loader',解析和转换.vue->js/css/html，再给对应loader处理
                use: [
                    'cache-loader',
                    'vue-loader'
                ]
            },
            {
                test: /\.js$/,
                use: 'Happypack/loader?id=babel',
                // include: [resolve('src'),resolve('node_modules/webpack-dev-server/client')],
                include: resolve('src')
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        ...genHappyPacks(),
        new VueLoaderPlugin()
    ],
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
