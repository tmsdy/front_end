// 1.常规按值传递
var value = 1;
function foo1(v) { //拷贝value成_value，函数中修改的都是 _value 的值,不影响原值
    v = 2;
    // console.log(v); //2
}
foo1(value);
// console.log(value) // 1

// 2.按引用传递
var obj = {
    value: 1
};
function foo2(o) {
    o.value = 2; //其实也是拷贝成_o和obj指向同一个对象地址，改属性value那么obj的value也变
    console.log(o.value); //2
}
foo2(obj);
console.log(obj.value) // 2

var obj = {
    value: 1
};
function foo3(o) {
    o = 2; //直接改_o不会影响obj
    console.log(o); //2
}
foo3(obj);
console.log(obj) // obj:{value:1} 因为这个obj没被改成2，所以是不是按引用传递而是按共享传递

// 共享传递：在传递对象的时候，传递对象的引用的副本。直接修改 o，并不会修改原值