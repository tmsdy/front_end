
function pv(ctx){ //上传日志信息
  global.console.log('请求路径：',ctx.path) ;

}

module.exports = function(){
  return async function(ctx,next){
    pv(ctx)
    await next() //当前的中间件运行完毕交给下一个中间件处理
  }
}