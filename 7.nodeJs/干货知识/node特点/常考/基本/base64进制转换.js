// base64 进制转换
/*
toString: 可以将任意进制转成任意进制
parseInt：可以将任意进制转成10进制
*/
let buf = Buffer.from('飞')
console.log(buf); //e9a39e
console.log(buf.toString('base64')); //6aOe
console.log((0xe9).toString(2)); //11101001
console.log((0xa3).toString(2)); //10100011
console.log((0x9e).toString(2)); //10011110

// 把一个汉字(3个字节，每个字节8位)的24位，转换成4个字节，每个字节就6位，不足的补0,转10进制去base64可见编码取值。
// 111010011010001110011110 -> 00111010 00011010 00001110 00011110
console.log(parseInt('00111010', 2)); // 58 -> 6
console.log(parseInt('00011010', 2)); // 26 -> a
console.log(parseInt('00001110', 2)); // 14 -> O
console.log(parseInt('00011110', 2)); // 30 -> e
let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
console.log(str[58] + str[26] + str[14] + str[30]); //6aOe

