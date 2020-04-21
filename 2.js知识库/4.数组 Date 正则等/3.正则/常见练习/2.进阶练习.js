// 1.千分位加逗号
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