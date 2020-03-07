const path = require('path')
const nodeExternal = require('webpack-node-externals')
const merge = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
    target: 'node', // 告诉webpack打包的是node环境文件
    entry: './src/server/index.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'server.js'
    },
    externals: [nodeExternal()], // 不打包node核心模块(因为不需要打包)
})

