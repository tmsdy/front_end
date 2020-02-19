const pi = 3.14 ;

const counter = function (arr) {
    return "数组长度为"+arr.length ;
};

const adder = function (a,b) {
    return `计算和为：${a+b}` ;
};

module.exports = {
    counter,
    adder,
    pi
} ;