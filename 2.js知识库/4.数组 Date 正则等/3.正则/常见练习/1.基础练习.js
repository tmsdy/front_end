// 1.trim过滤空格
function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
}
console.log(trim('    hello '))

// 2.获取url某个参数
let href = '//detail.tmall.com/item.htm?id=615966253103&rn=1419cf99c83ee434be65f5f8360f0014&abbucket=20'
console.log('id==', href.match(/([&|?]id=)(\d+)/))

// 3.过滤标签
let mailAddress = `123@<span class="text-red">123</span>.com`
console.log(mailAddress.replace(/<[^>]+>/g, ''))