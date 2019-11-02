"use strict";

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return call && (typeof call === "object" || typeof call === "function")
        ? call
        : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function, not " +
            typeof superClass
        );
    }
    // 拿到浅复制父级的prototype赋给子级，再加上constructor指向
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) // 就是subClass.__proto__ = superClass，为了让子类继承父类的静态属性
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Parent = (function () {
    function Parent(name) {
        _classCallCheck(this, Parent);

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

var Child = (function (_Parent) {
    _inherits(Child, _Parent);

    function Child(name, age) {
        _classCallCheck(this, Child);
        //类似Parent.call(this,...)，所以继承实现是寄生组合继承的。因为得有构造继承才不会出现引用类型篡改问题
        var _this = _possibleConstructorReturn(
            this,
            (Child.__proto__ || Object.getPrototypeOf(Child)).call(this, name) //就是获取子类proto
        );

        _this.age = age;
        return _this;
    }

    _createClass(Child, [
        {
            key: "getAge",
            value: function getAge() {
                console.log(this.age);
            }
        }
    ]);

    return Child;
})(Parent);
