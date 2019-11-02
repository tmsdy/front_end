var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      // 真正的向Parent类的原型对象上增加属性
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  // Parent('feifei')检测这种把类当做普通函数调用会报错，需要new Parent('ff')来用
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Parent = (function() {
  //函数自执行实现私有作用域
  function Parent(name) {
    _classCallCheck(this, Parent); //类调用检查

    this.name = name;
  }

  _createClass(
    Parent,
    [
      {
        key: "getName",
        value: function getName() {
          console.log(this.name);
        }
      }
    ],
    [
      {
        key: "hello",
        value: function hello() {
          console.log("hello");
        }
      }
    ]
  );

  return Parent;
})();
