/**
 * 1.await后面得跟 Promise(不然这种写法就没意义了)
 */
let fs  = require('fs')
let Promise = require('./bluebird') //有空再去看看promisifyAll
let readFile = Promise.promisify(fs.readFile) //把普通函数转化为返回Promise的函数

let upperArr = __dirname.split('\\') //等待正则搞定
upperArr.pop()
let upper_dirname = upperArr.join('\\')

async function read(){ //async函数返回Promise
  try{
    let a = await readFile(upper_dirname+'/1.txt','utf8')
    console.log(a)
  }catch(err){
    console.error(err)
  }
  let b = await readFile(upper_dirname+'/2.txt','utf8')
  console.log(b)
  let c = await readFile(upper_dirname+'/3.txt','utf8')
  console.log(c)

  return 'ok'
}
read().then(res=>{
  console.log(res)
})
