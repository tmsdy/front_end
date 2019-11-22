function Foo() {
    Foo.a = function () {
        console.log(1)
    }
    this.a = function () {
        console.log(2)
    }
}
Foo.prototype.a = function () {
    console.log(3)
}
Foo.a = function () {
    console.log(4)
}
Foo.a(); // 4 这里还没新建对象
let obj = new Foo();
obj.a(); // 2
Foo.a(); // 1 构造函数覆盖了Foo.a