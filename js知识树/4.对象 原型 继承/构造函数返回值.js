/*
构造函数不需要显示的返回值。使用new来创建对象(调用构造函数)时，如果return的是非对象(数字、字符串、布尔类型null等)
会忽而略返回值;如果return的是对象，则返回该对象
*/
function Person(name) {
    this.name = name
    return name; //忽略
}
let p = new Person('Tom');
console.log(p) // {name: 'Tom'}

function Person2(name) {
    this.name = name
    return {}
}
let p2 = new Person2('Tom');
console.log(p2) //{}