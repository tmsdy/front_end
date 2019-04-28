/*
async/await
    1.可以借助 babel 在生产环境中使用，是 Generator 函数的语法糖
    2.优于Promise:
      1)不同Promise之间共享数据问题
      2)更好的处理then链
      3)更易于调试
    3.对异常的处理很方便
  最大价值：是异步代码形式上更接近于同步代码
  await是个运算符，会阻塞后面的代码，如果接的是Promise会得到resolve的值，否则会得到一个表达式的运算结果

1.async 会取代 Generator 吗？
Generator 本来是用作生成器，使用 Generator 处理异步请求只是一个比较 hack 的用法，在异步方面，
async 可以取代 Generator，但是 async 和 Generator 两个语法本身是用来解决不同的问题的。

2.async 会取代 Promise 吗？
  1)async 函数返回一个 Promise 对象
  2)面对复杂的异步流程，Promise 提供的 all 和 race 会更加好用
  3)Promise 本身是一个对象，所以可以在代码中任意传递
  4)async 的支持率还很低，即使有 Babel，编译后也要增加 1000 行左右
  最佳实践：除了需要并行加载等复杂些的异步请求，简单点的都可以用async
*/
function a(){
  return new Promise((resolve,reject)=>{
    try{
      // reject('error111')
      throw Error
      setTimeout(()=>{
        resolve('resolve')
      },2000)
    }catch{
      reject('error222')
    }
  })
}
  var b = async function() {
    try {
      var res = await a()
      console.log('res',res)
    } catch (err) {
      console.log('err',err)
    }
  };

  b();