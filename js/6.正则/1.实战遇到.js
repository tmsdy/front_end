// 1.从文件路径中匹配文件名
let path = '/storage/emulated/0/shumei.txt'
console.log(path.match(/([^<>/\\\|:""\*\?]+)\.\w+$/)) //不带扩展名
console.log(path.match(/[^<>/\\\|:""\*\?]+\.\w+$/)) //带扩展名