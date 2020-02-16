
const Example = (function() {
    var _private = Symbol('private');

    class Example {
        constructor() {
          this[_private] = 'private';
        }
        getName() {
          return this[_private];
        }
    }

    return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex.name); // undefined
/*
优点
  无命名冲突
  外部无法访问和修改
  无性能损失
缺点
  写法稍微复杂
  兼容性也还好
*/