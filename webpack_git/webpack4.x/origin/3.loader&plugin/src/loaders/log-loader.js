const path = require('path');

//文件的原内容,如果是加载的是js，项目中有用到10个js文件就会走这里十次
module.exports = function (source){
    console.log('loading')
    // return source
    this.callback(null, source)
}
