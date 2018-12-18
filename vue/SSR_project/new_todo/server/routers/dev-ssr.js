const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const MemoryFS = require('memory-fs')
const fs = require('fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

let bundle
serverCompiler.watch({},(err,status) => { //client文件夹改变它能重新编译生成新文件
    if(err) throw err ;
    status = status.toJson() ;
    status.errors.forEach(err => console.log(err)) ;
    status.warnings.forEach(warn => console.warn(err)) ;

    const bundlePath = path.join(
        serverConfig.output.path ,
        'vue-ssr-server-bundle.json'
    )
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8')) ;
    console.log('打包成功')
})

const handleSSR = async (ctx) => {
    if (!bundle) {
        ctx.body = '等等哈'
        return 
    }

    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8000/vue-ssr-client-manifest.json'
    )
    const clientManifest = clientManifestResp.data

    const template = fs.readFileSync(
        path.join(__dirname, '../server.template.ejs'),
        'utf-8'
    )
    const renderer = VueServerRenderer.createBundleRenderer(bundle,{
        inject: false ,//取消自动注入的操作
        clientManifest
    })

    await serverRender(ctx,renderer,template)
}

const router = new Router() ;
router.get('*',handleSSR) ;

module.exports = router
