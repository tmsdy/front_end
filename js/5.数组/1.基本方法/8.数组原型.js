
function array_max(){
    return Math.max.apply(Math,this);    //max取最大值，min取最小值。还有很多数学运算
}
Array.prototype.max = array_max;         //重写数组原型链
var x = new Array(1, 2, 3, 4, 5, 6);     //应用自定义原型函数
var y = x.max( );