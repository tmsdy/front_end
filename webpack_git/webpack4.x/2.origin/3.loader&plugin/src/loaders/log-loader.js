const path = require('path');

//文件的原内容,如果是加载的是js，项目中有用到10个js文件就会走这里十次
module.exports = function (source){
    // 源码的 isAsync = false，默认为false，调用了this.async能将其变成true
    // console.log(this)

    // let callback = this.async() //支持异步loader
    // setTimeout(()=>{
    //     callback(null, source) //和return写法一个效果
    // },1000)
    console.log('log-loading')
    
    return source 
}
