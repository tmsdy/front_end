// 1.trim过滤空格
function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
}
console.log(trim('    hello '))


// 3.过滤标签
let mailAddress = `123@<span class="text-red">123</span>.com`
console.log(mailAddress.replace(/<[^>]+>/g, ''))