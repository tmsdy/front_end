class Example {
  constructor() {
    var _private = '';
    _private = 'private';
    this.getName = function() {return _private}
  }
}

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex._private); // undefined
/**
 优点
  无命名冲突
  外部无法访问和修改
缺点
  constructor 的逻辑变得复杂。
  方法存在于实例，而非原型上，子类也无法使用 super 调用
  构建增加一点点开销
 */