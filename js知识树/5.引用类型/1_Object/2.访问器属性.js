/*
    访问器属性：包含一对儿getter和setter函数(都不是必须指定)
        在读取访问器属性时会调用getter函数，返回有效的值
        在写入访问器属性时，会调用setter函数并传入新值，这个函数负责决定如何处理数据
    4个特性:
        [[Configurable]]:表示能否通过delete删除属性而重新定义属性，默认为true
        [[Enumerable]]:表示能否通过for-in循环返回属性，默认为true
        [[Get]]:再读取属性时调用的函数。默认值为undefined。
        [[Set]]:在写入属性时调用的函数。默认值为undefined。
    访问器不能直接定义，必须使用Object.defineProperty()来定义。
*/
var book = {
    _year: 2004,//加下划线表示只能通过对象方法访问的属性
    edition: 1
}

Object.defineProperty(book, "year", {//这里面的函数不能用箭头函数的语法-----------------------
    get: function () {
        return this._year;
    },
    set: function (newValue) {//访问器常见方式，设置一个属性的值会导致其他属性发生变化
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    }
});

book.year = 2005;
// book._year = 2008 ; //可以这么改的啊
console.log(book);

var person = {
    name: "feifei",
    age: 21
}
Object.defineProperty(person, "name", {//只指定getter意味属性不能写，只指定setter意味属性不能读，严格模式会报错
    get: function () {
        return this.name;
    }
})
person.name = "afang";
console.log(person);

//定义多个属性的写法
var book2 = {};

Object.defineProperties(book, {
    _year: {
        writable: true,
        value: 2004
    },
    edition: {
        writable: true,
        value: 1
    },
    year: {
        get: function () {
            return this._year;
        },
        set: function (newValue) {
            if (newValue > 2004) {
                this._year = newValue;
                this.edition += newValue - 2004;
            }
        }
    }
})