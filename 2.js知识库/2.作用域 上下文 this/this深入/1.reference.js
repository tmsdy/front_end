/*

ECMAScript 的类型分为语言类型和规范类型
语言类型:可以直接操作的，Undefined, Null, Boolean, String, Number, 和 Object这些
规范类型：用来用算法描述 ECMAScript 语言结构和语言类型的。规范类型包括：Reference, List, Completion...

Reference 类型：
  1.它与 this 的指向有着密切的关联
  2.用来解释诸如 delete、typeof 以及赋值等操作行为的
Reference的构成：
  base: 属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object,
             a Boolean, a String, a Number, or an environment record 其中的一种。
  name: 属性的名称
  strict

var foo = 1;
对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
}
var foo = {
    bar: function () {
        return this;
    }
};
foo.bar(); // foo
bar对应的Reference是：
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};

*/
var foo = 1;
getBase(foo)