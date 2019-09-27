const Koa = require('koa')
const serve = require('koa-static')
const SourceMap = require('./middleware/sourceMap')

const app = new Koa()
const port = 3003

app.use(SourceMap)
app.use(serve(__dirname + '/client'))

app.listen(port, () => {
    console.log(`${port} is listen`)
})