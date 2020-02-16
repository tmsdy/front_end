
Function.prototype.myBind = function (context) {
    if (typeof this !== 'function') {
        throw new TypeError('Error')
    }
    var _this = this
    var args = [...arguments].slice(1);//前面括号传的在obj后参数

    return function F() {
        if (this instanceof F) { //* 如果多次bind，只由第一次bind决定
            return new _this(...args, ...arguments)
        }
        return _this.apply(context, [...args, ...arguments])
    }
}

Function.prototype.myBind2 = function (ctx) {
    if (typeof this !== 'function') {
        throw new Error('error')
    }
    let args = [...arguments].slice(1)
    let _this = this
    return function Fn() {
        if (this instanceof Fn) {
            _this(...args, ...[...arguments])
        }
        _this.apply(ctx, [...args, ...[...arguments]])
    }

}

let obj = { name: 'feifei' }
let a = { name: 'aaa' }

function Son(name) {
    console.log(this.name)
    console.log(name)
}

Son.myBind2(obj, 'jiejie')(); //参数在前面后面传都行

// 不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定

function fn() {
    console.log(this.name)
}
fn.myBind2(obj).myBind2(a)() // feifei