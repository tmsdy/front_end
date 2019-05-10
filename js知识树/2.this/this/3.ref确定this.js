var value = 1;
var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}
console.log(foo.bar());
console.log((foo.bar)());
console.log((foo.bar = foo.bar)());
console.log((false || foo.bar)());
console.log((foo.bar, foo.bar)()); 
// 结果 2 2 1 1 1 
/*
判断 ref 是不是一个 Reference 类型
    1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
    2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)
        该函数始终返回 undefined
    3 如果 ref 不是 Reference，那么 this 的值为 undefined

1.foo.bar()
 1)ref为foo.bar，属于属性访问，返回Reference类型
 2)如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
var Reference = {
  base: foo, //是对象所以IsPropertyReference(ref)为true，GetBase(ref)为foo
  name: 'bar',
  strict: false
}

2.(foo.bar)()
foo.bar 被 () 包住，实际上 () 并没有对 MemberExpression 进行计算，所以其实跟示例 1 的结果是一样的

3.(foo.bar = foo.bar)()
有赋值操作符，使用了 GetValue，所以返回的值不是 Reference 类型，this 的值为 undefined

4.(false || foo.bar)()
使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined
严格模式下this 返回 undefined，非严格模式就是全局对象

function foo() {
    console.log(this)
}
foo(); 
MemberExpression 是 foo，解析标识符，查看规范 10.3.1 Identifier Resolution，会返回一个 Reference 类型的值：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)
 
*/
