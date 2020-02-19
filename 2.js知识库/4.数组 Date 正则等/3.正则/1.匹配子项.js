/*
匹配子项 : 小括号 ()  (分组操作)
1+1*2
(1+1)*2

把正则的整体叫做（母亲）
然后把左边第一个小括号里面的正则，叫做这个第一个子项(母亲的第一个孩子)
第二个小括号就是第二个孩子
*/

var str = '2013-6-7';

var re = /(\d+)(-)/g;

str = str.replace(re, function ($0, $1, $2) {
    console.log($0, $1, $2)
    return $1 + '.';
});

console.log(str);   //2013.6.7

var re = /(a)(b)(c)/;

console.log('abc'.match(re));  //[abc,a,b,c](当match不加g的时候才可以获取到子项的集合)

