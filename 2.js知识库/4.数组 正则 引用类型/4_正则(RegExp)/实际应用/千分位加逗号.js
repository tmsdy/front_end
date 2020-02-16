// 如何将浮点数点左边的数每三位添加一个逗号，如12000000.11转化为『12,000,000.11』?
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