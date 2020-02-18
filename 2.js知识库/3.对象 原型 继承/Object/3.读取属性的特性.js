//js中可以针对任何对象包括DOM,BOM对象使用Object.getOwnPropertyDescriptor()方法，IE9+支持
var book = {};

Object.defineProperties(book, {
    _year: {
        value: 2004
    },
    edition: {
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
});

var descriptor1 = Object.getOwnPropertyDescriptor(book, "_year");
console.log(descriptor1) //{configurable:false,enumerable:false,value:2004,writable:false}

var descriptor2 = Object.getOwnPropertyDescriptor(book, "year");
console.log(descriptor2) //{configurable:false,enumerable:false,get:function(...),set:function(...)}
