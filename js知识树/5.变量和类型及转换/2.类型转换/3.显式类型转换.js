/* 
    parseInt和parseFloat专门用于把字符串转换成数值，
    如果第一个字符不是数字字符或者负号， parseInt()就会返回 NaN
 */ 
var num1 = parseInt("1234blue"); // 1234
console.log('num1= '+num1) ;

var num2 = parseInt(""); // NaN
console.log('num2= '+num2) ;

var num3 = parseInt("0xA"); // 10（十六进制数）
console.log('num3= '+num3) ;

var num4 = parseInt(22.5); // 22
console.log('num4= '+num4) ;

var num5 = parseInt("070"); // 56（八进制数）
console.log('num5= '+num5) ;

var num6 = parseInt("70"); // 70（十进制数）
console.log('num6= '+num6) ;

var num7 = parseFloat("0908.5"); //908.5
console.log('num7= '+num7) ;

var num8 = parseFloat("3.125e7"); //31250000   
console.log('num8= '+num8) ;

// Number()可以用于任何数据类型 

var a = '+100';
console.log( 'a= '+Number(a) );			// 100

var a1 = '';
console.log( 'a1= '+Number(a1) );		// 0

var a2 = true;
console.log( 'a2= '+ Number(a2) );		// true为1  false为0

var a3 = [ 1,3];
console.log( 'a3= '+Number(a3) );		// NaN

var a4 = [ 1];
console.log( 'a4= '+Number(a4) );		// 1

var a5 = null;
console.log( 'a4= '+ Number(a5) );		// 0

console.log(Number('hello')) ;          // NaN
console.log(Number(''))         // 0