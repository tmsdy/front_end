//不传入第一个参数，那么默认为 window
// 改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？
Function.prototype.myCall = function (context) {
  let _obj = context || window ;
  // getValue.call(a, 'yck', '24') => a.fn = getValue 把构造函数变成指向对象的属性
  _obj.fn = this;
  _obj.fn(...[...arguments].slice(1));
  delete _obj.fn
}

Function.prototype.myApply = function (context) {
  let _obj = context || window ;
  _obj.fn = this ;
  arguments[1] ? _obj.fn(...arguments[1]):_obj.fn() ;
  delete context.fn
}

let a = {
  value: 1
}
function getValue(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value)
}
getValue.myCall(a, 'yck', '24') ;
getValue.myApply(a, ['yck', '24']) ;

// 这里是用es6写的比较简便，冴羽那儿有es5的实现