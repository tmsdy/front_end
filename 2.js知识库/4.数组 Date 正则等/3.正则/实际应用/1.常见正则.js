// 1.常见
var re = {
    chinese: /[\u4e00-\u9fa5]/, //中文
    qq: /^[1-9]\d{4,11}$/,
    email: /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/, //邮箱
    id_card: /[1-9]\d{14}|[1-9]\d{17}|[1-9]\d{16}x/,//身份证
}

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