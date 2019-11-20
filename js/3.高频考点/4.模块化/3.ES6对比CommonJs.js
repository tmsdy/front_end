/*

CommonJS:
  1) 运行时加载,模块输出的是一个值的拷贝，可以理解为跟函数传值一个道理
counter.js：
    var counter = 3;
    function incCounter() {
        counter++;
    }
    module.exports = {
        counter: counter,
        incCounter: incCounter,
    };
    引入模块 main.js
    var mod = require('./counter');

    console.log(mod.counter);  // 3
    mod.incCounter();
    console.log(mod.counter); // 3

ES6:
  1) 模块动态引用,模块输出的是值的引用。遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值
    所以counter会从3变到4
counter.js：
    export let counter = 3;
    export function incCounter() {
        counter++;
    }

main.js
    import { counter, incCounter } from './counter';
    console.log(counter); // 3
    incCounter();
    console.log(counter); // 4

分析：因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，
        它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。




*/