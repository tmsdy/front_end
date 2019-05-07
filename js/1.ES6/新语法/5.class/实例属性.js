// 1.以前，我们定义实例属性，只能写在类的 constructor 方法里面。比如：
class Person {
    constructor() {
        this.state = {
            count: 0
        };
    }
}
// 2.然而现在有一个提案，对实例属性和静态属性都规定了新的写法，而且 Babel 已经支持。现在我们可以写成：
class Person {
    state = {
        count: 0
    };
}
// 对应到 ES5 都是：
function Person() {
    this.state = {
        count: 0
    };
}