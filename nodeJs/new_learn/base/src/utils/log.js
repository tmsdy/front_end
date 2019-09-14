const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV

// 写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')  // 关键代码
}

// 生成 write Stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a' //累加生成，不会清空
    })
    return writeStream
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    // if (env === 'production') {
    writeLog(accessWriteStream, log)
    // }
}

module.exports = {
    access
}