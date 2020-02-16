// example 1
var a = {}, b = '123', c = 123;
a[b] = 'b'; // a['123'] = 'b'
a[c] = 'c'; // a['123'] = 'c' 数字123转成字符串'123'
console.log(a[b]);

// example 2
var a = {}, b = Symbol('123'), c = Symbol('123');
a[b] = 'b'; // b 是 Symbol 类型，不需要转换。
a[c] = 'c'; // c 是 Symbol 类型，不需要转换。任何一个 Symbol 类型的值都是不相等的，所以不会覆盖掉 b。
console.log(a[b]);

// example 3
var a = {}, b = { key: '123' }, c = { key: '456' };
a[b] = 'b';// b 不是字符串也不是 Symbol 类型，需要转换成字符串。对象类型会调用 toString 方法转换成字符串 [object Object]。
a[c] = 'c';// c 不是字符串也不是 Symbol 类型，需要转换成字符串。对象类型会调用 toString 方法转换成字符串 [object Object]。
console.log(a[b]);