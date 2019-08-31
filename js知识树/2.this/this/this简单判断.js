/** 掘金：https://juejin.im/post/5a0d9ff4f265da432e5b91da
 * 阮一峰：http://www.ruanyifeng.com/blog/2018/06/javascript-this.html
 * 1.普通函数指向函数的调用者:有个简便的方法就是看函数前面有没有点,如果有点,那么就指向点前面的那个值
 * 2.箭头函数指向函数所在的所用域: 注意理解作用域,只有函数的{}构成作用域,对象的{}以及 if(){}都不构成作用域;
 */
const obj = {
    name: 'objName',
    say() {
        console.log(this.name);
    },
    read: () => {
        console.log(this.name);
    }
}
obj.say(); // objName（obj）
obj.read(); // undefined（window)

var length = 10;
function fn() {
    console.log(this.length);
}

const obj2 = {
    length: 5,
    method: function (fn) {
        fn();
        arguments[0](); //是类数组对象，长度为2
    }
};

obj2.method(fn, 1); // 10 2