// * 1.Object.values() 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历属性值
const obj = { foo: 'bar', baz: 42 };
console.log(Object.values(obj)) // ["bar", 42]

// 如果属性名为数值的属性，是按照数值大小，从小到大遍历的，因此返回的顺序是b、c、a。
const obj2 = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.values(obj2)) // ["b", "c", "a"]
