
const Example = (function() {
  var _private = '';

  class Example {
    constructor() {
      _private = 'private';
    }
    getName() {
      return _private;
    }
  }
  return Example;

})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex._private); // undefined

/*
优点
  无命名冲突
  外部无法访问和修改
缺点
  写法有一点复杂
  构建增加一点点开销
*/