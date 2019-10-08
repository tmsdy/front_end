let fs = require('fs')
let path = require('path')


fs.readFile(path.join(__dirname, 'txt/1.txt'), {
    encoding: 'utf8',
    flaflaggs: 'r'
}, function (err, data) { //异步的读，没有返回值有回调
    if (err) {
        console.error(err)
    } else {
        console.log(data)
        // console.log(data.toString())
    }
})

fs.writeFile(path.join(__dirname, 'txt/2.txt'), 'data11', {
    encoding: 'utf8',
    flag: 'w'
}, function (err) {
    console.log(err)
})

// 追加写入
fs.appendFile(path.join(__dirname, 'txt/3.txt'), 'appendFile_data...', function (err) {
    console.log(err)
})