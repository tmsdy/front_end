
/*
1.JSON
    1.会忽略 undefined Symbol
    2.不能序列化函数，会忽略函数
*/
var obj1 = { a: 1, arr: [2, 3] };

JSON.parse(JSON.stringify(obj1));


