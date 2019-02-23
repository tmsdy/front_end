/**
 * async/await号称异步的终极解决方案,其实是generator+Promise的语法糖
 * 优点：
 *  1)简洁语义化
 *  2)很好的处理异步 throw error return try catch
 */

let fs  = require('fs')
let co = require('./2.co源码')
let upperArr = __dirname.split('\\') //等待正则搞定
upperArr.pop()
let upper_dirname = upperArr.join('\\')

function readFile(filename){
  return new Promise((resolve,reject)=>{
    fs.readFile(filename,'utf8',(err,data)=>{
      throw new Error('抛出异常')
      err ? reject(err) : resolve(data)
    })
  })
}

// async function read(){ //async函数返回Promise
//   try{ //如果await后面异步出错，相当于async函数返回Promise出错
//     let a = await readFile(upper_dirname+'/1.txt') 
//     console.log(a)
//   }catch(err){
//     console.error(err)
//   }
//   let b = await readFile(upper_dirname+'/2.txt')
//   console.log(b)
//   let c = await readFile(upper_dirname+'/3.txt')
//   console.log(c)
  
//   return 'ok'
// }
// 相当于：
function read(){
  return co(function*() {
    try{
      let a = yield readFile(upper_dirname+'/1.txt')
      console.log(a)
    }catch(err){ 
      console.error(err)
    }
    let b = yield readFile(upper_dirname+'/2.txt')
    console.log(b)
    let c = yield readFile(upper_dirname+'/3.txt')
    console.log(c)
    
    return 'ok'
  });
}

read().then(res=>{
  console.log(res) //ok
})