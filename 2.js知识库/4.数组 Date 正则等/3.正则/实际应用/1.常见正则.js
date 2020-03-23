
// 2.千分位加逗号
var num1 = '12000000.11';

console.log(commafy(num1))

function commafy(num) { //有小数点的
  return num && num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($1, $2) {
    return $2 + ',';
  });
}

function commafy_2(num) { //没有小数点的
  return num && num.toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',');
}

// 3.从文件路径中匹配文件名
let path = '/storage/emulated/0/shumei.txt'
console.log(path.match(/([^<>/\\\|:""\*\?]+)\.\w+$/)) //不带扩展名
console.log(path.match(/[^<>/\\\|:""\*\?]+\.\w+$/)) //带扩展名
console.log(path.match(/\.\w+$/)[0].slice(1)) //后缀名

// 4.过滤标签
let mailAddress = `123@<span class="text-red">123</span>.com`
console.log(mailAddress.replace(/<[^>]+>/g, ''))