
/*
1.JSON
    1.会忽略 undefined symbol
    2.不能序列化函数函数
*/
var obj1 = { a:1, arr: [2,3] };

JSON.parse(JSON.stringify(obj1)) ;

/*
2.$.extend
*/
// var obj4 = $.extend(true,{},obj1) ;

