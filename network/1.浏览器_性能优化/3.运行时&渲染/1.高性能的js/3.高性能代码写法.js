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
// 二进制的判断
let NoContext = 0b000
let ConcurrentMode = 0b001
let StrictMode = 0b010
let ProfileMode = 0b100
let mode

// 判断是不是ConcurrentMode
console.log(0b001 & ConcurrentMode) // 1
console.log(0b000 & ConcurrentMode) // 0

mode = mode | ConcurrentMode //如果mode没有就给它赋值ConcurrentMode
console.log(mode & ConcurrentMode) // 1
mode |= StrictMode //和上面或操作一样，现在mode有了ConcurrentMode和StrictMode
console.log(mode & ConcurrentMode) // 1
console.log(mode & StrictMode) //2