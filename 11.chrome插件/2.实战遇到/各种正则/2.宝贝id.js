// 1.取出字符串中-后面的字符串
let str = '盒马进口泰国金枕榴莲1粒装4-6斤金枕头整个带壳榴莲新鲜当季水果-tmall.com天猫'
console.log(str.match(/(-[^-]+)$/))