var fs = require('fs') ;

var read_me = fs.readFileSync('read_me.txt','utf8') ;//同步读取文件
// console.log(read_me) ;

fs.writeFileSync('write_me.txt',read_me) ;//同步写入文件

fs.readFile('read_me.txt','utf8',function (err,data) {//异步读取文件,异步写入的方法类似就不写了
    if(err) throw err ;
    console.log(data) ;
});
console.log('111') ;