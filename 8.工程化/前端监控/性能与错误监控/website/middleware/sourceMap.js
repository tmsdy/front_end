const fs = require('fs')
const path = require('path')
let sourceMap = require('source-map')

let sourcemapFilePath = path.join(__dirname, '../client/vue-test/dist/bundle.js.map')
// let sourcemapFilePath = path.join(__dirname, '../client/vue-test/dist/26.js')

let sourceFileMap = {}
let fixPath = (filePath) => {
    return filePath.replace(/\.[\.\/]+/, '')
}

module.exports = async (ctx, next) => {
    if (ctx.path === '/sourcemap') {
        let sourceMapContent = fs.readFileSync(sourcemapFilePath, 'utf-8')
        let fileObj = JSON.parse(sourceMapContent)
        let { sources } = fileObj
        sources.forEach(item => {
            sourceFileMap[fixPath(item)] = item
        })
        // let line = 613;
        // let column = 13;
        let line = 7;
        let column = 69416;
        const consumer = await new sourceMap.SourceMapConsumer(sourceMapContent);
        let res = consumer.originalPositionFor({ line, column })

        // let originSource = sourceFileMap[res.source]
        // console.log(sources.indexOf(originSource))
        // let sourcesContent = fileObj.sourcesContent[sources.indexOf(originSource)]
        let sourcesContent = fileObj.sourcesContent[sources.indexOf(res.source)]
        let sourcesContentArr = sourcesContent.split('\n')
        // console.log(res)
        ctx.body = { sourcesContentArr, sourcesContent, res }
        // ctx.body = fileObj
    }
    return next()
}