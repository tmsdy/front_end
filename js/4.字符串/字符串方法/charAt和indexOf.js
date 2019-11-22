var str = 'www.miaov.com/2013ww';

console.log(str.charAt(8)); //v

console.log(str.indexOf('m')); //4
console.log(str.indexOf('m', 5)); //12 从字符串第5后面开始找 
console.log(str.indexOf('X')); // -1 表示没找到

var str2 = '妙味课堂是一支独具特色的IT培训团队，妙味反对传统IT教育枯燥乏味的教学模式，妙味提供一种全新的快乐学习方法！';

var s = '妙味';
var i = 0;
/*
for( ; str.indexOf( s, i ) != -1 ; ){
	alert( str.indexOf( s, i ) );
	i = str.indexOf( s, i ) + s.length;
}
*/
while (str2.indexOf(s, i) != -1) {
    console.log(str2.indexOf(s, i));
    i = str2.indexOf(s, i) + s.length;
}

str2.indexOf('妙味', 2)			// 从左往右找
console.log(str2.lastIndexOf('妙味', 38)) //从右往左找