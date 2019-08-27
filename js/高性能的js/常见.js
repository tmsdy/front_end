/*

1.使用Object、Array直接量
直接{},[]声明比new Object(),new Array()要快

2.位操作速度快
判断i是不是奇数
if(i%2){ ... }和 if(i&1){ ... } 都行，后者要快50%

3.原生方法也快，是由js引擎提供的

4.浮点型转整形，Math是内部对象，很快，不用parseInt
let num = Math.floor('1.6');


*/