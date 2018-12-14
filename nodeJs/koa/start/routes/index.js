const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/test',async (ctx)=>{
  global.console.log('start',new Date().getTime()) ;
  const a = await new Promise((resolve,reject)=>{
    setTimeout(() => {
      global.console.log('async aaa',new Date().getTime()) ;
      resolve('aaa')
    }, 1000);
  })
  const b = await 123 ; //这样写里面会转成下面的写法
  // const b = await Promise.resolve(123)
  ctx.body = {
    a,b
  }
})

module.exports = router
