/*
1.把数组的shift方法给类数组arguments用，arguments第一个参数(构造函数)会被取出
2.把obj的__proto__指向拿出的构造函数的原型
3.走一下构造函数改this为obj传剩下参数，如果返回对象时则返回这个对象，否则就返回obj就行了。
*/
function myNew() {
    var obj = {}
    Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype // 原型链
    var ret = Constructor.apply(obj, arguments) // 改this+传参
    return typeof ret === 'object' ? ret : obj
};

function Otaku(name, age) {
    this.name = name;
    this.age = age;
    this.habit = 'Games';
}

Otaku.prototype.strength = 60;
Otaku.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}
var person = myNew2(Otaku, 'Kevin', '18')

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60
person.sayYourName(); // I am Kevin
