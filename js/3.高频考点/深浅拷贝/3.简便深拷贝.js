
/*
1.JSON
    1.会忽略 undefined symbol
    2.不能序列化函数，会忽略函数
*/
var obj1 = { a: 1, arr: [2, 3] };

JSON.parse(JSON.stringify(obj1));

/*
2.$.extend
*/
// var obj4 = $.extend(true,{},obj1) ;

// 3.模拟实现一个深拷贝，并考虑对象相互引用以及 Symbol 拷贝的情况

