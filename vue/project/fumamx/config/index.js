'use strict'

const path = require('path')

module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/pcapi': {
                target: 'http://localhost:9000',
                pathRewrite: {
                    '^/pcapi': '/pcapi'
                }
            }
        },

        // Various Dev Server settings
        host: '0.0.0.0', //修改‘0.0.0.0’后局域网其他机器可以访问 'localhost'局域网其他机器不能访问 // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, 

        useEslint: true,
        showEslintErrorsInOverlay: true,

        devtool: 'cheap-module-eval-source-map',
        cacheBusting: true,
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.ejs'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        devtool: 'cheap-module-source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        bundleAnalyzerReport: process.env.npm_config_report
    }
}