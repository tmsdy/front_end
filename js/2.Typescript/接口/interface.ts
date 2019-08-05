/*
 接口： 约定，限制一种结构规则。要是实现了这个接口就得遵守我定的规则
 一种理解：
    对象抽象 => 类（对象的抽象描述）
    类抽象 => 抽象类（如果一个类中拥有一个没有具体实现的抽象方法，就是抽象类）
    抽象类中没有实现的抽象方法 => 接口 （如果一个抽象类的成员全部是抽象的，那么可以看作接口）
 */
interface Point { //接口没有具体化的值的
  x: number,
  y: number,
  z?: number,// ?表示可选
}

var p: Point;

p = { x: 12, y: 5 } //可以
p = { y: 12, x: 8 } //可以，没有顺序的问题
p = { x: 12, y: 5, z: 'abc' }//不行
p = { x: 12, y: 5, z: 123 }//可以

// 2.
interface A {
  x: number,
  y: number
}
interface B {
  x: number,
  y: number,
  z: number
}
var a: A | B;
console.log(a.x); //可以
console.log(a.y); //可以
console.log(a.z); //不行

// 对象定义任意属性，一旦定义了任意属性，那么确定属性和可选属性都必须是它的子属性
// 参考：https://www.jianshu.com/p/1c2fb566cdd2
interface Person {
  name: string;
  age?: number;
  [propName: string]: string;
}
let tom: Person = {
  name: 'Tom',
  age: 25,
  gender: 'male'
};
