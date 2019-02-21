/**
 * 1.目标：异步读一个文件
 * 2.回调的特点：error first
 *  调用回调函数的时候第一个函数永远是错误对象
 * 3.回调函数的问题
 *  1)try catch无法及时捕获错误
 *  2)不能return
 *  3)回调地狱
 */
let fs  = require('fs')
let upperArr = __dirname.split('\\') //等待正则搞定
upperArr.pop()
let upper_dirname = upperArr.join('\\')

function read(filename){
  // fs.readFile(filename+`${filename}`,'utf8',function(err,data){
    fs.readFile(upper_dirname+'/1.txt','utf8',function(err,data){
    // throw new Error('出错了')
    if(err){ //如果出错了
      console.log(err)
    }else{ //成功了
      console.log(data)
    }
  })
}
try{
  read('1.txt') //try执行读取文件时候没错可捕获，try执行完出错捕获不了了
}catch(err){
  console.log(err)
}
console.log(222)