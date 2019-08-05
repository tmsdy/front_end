/*

1.JSX 元素类型“{}”不是 JSX 元素的构造函数
在函数组件中容易出现这问题，需要用Fragment把返回的东西包一下

2.ts导出的时候不能用commonJs的module.exports

3.对象定义任意属性
参考：https://www.jianshu.com/p/1c2fb566cdd2
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

*/
