const Koa = require('koa')
const app = new Koa()
const pageRouter = require('./routers/dev-ssr')

const isDev = process.env.NODE_ENV === 'develoment'

app.use(async (ctx,next) =>{
    try{
        console.log(ctx.path)
        await next() 
    }catch(err){
        console.log(err)
        ctx.status = 500 ;
        ctx.body = err.message ;
    }
})
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT,HOST,() => {
    console.log(`server is listening on ${HOST}:${PORT}`)
})
