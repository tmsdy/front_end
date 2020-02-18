
// 把函数加到指向的对象的属性上再执行，然后在执行完以后删除
Function.prototype.myCall = function (ctx) {
    let _obj = ctx || window
    _obj.fn = this
    _obj.fn(...[...arguments].slice(1))
    delete _obj.fn
}

Function.prototype.myApply = function (context) {
    let _obj = context || window;
    _obj.fn = this;
    arguments[1] ? _obj.fn(...arguments[1]) : _obj.fn();
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
getValue.myCall2(a, 'yck', '24');
getValue.myApply(a, ['yck', '24']);

// 这里是用es6写的比较简便，冴羽那儿有es5的实现