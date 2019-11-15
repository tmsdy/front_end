/*

js被归类为解释型语言，不过它是一门编译语言

程序中一段源代码在执行之前会经历三个步骤：统称为编译
1.词法分析
由字符组成的字符串分解成有意义的代码块（对编程语言来说，也称词法单元）
例如：var a = 2 ;通常被分解为var、a、=、2、;这些词法单元

2.语法解析
将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树（抽象语法树AST）
var a = 2 ; 的AST可能是：
VariableDeclaration：{
Identifier：a ,
AssignmentExpression:{
NumericLiteral:2
}
}

3.代码生成 : 将AST转换成可执行代码的过程
就是把var a = 2 ;的AST树转化为一组机器指令用来创建一个叫作a的变量（包括分配内存）并将一个值存储在a中

对于js，大部分情况下编译发生在代码执行前的几微秒时间内，对于作用域，js引擎用尽办法比如JIT来延迟编译
甚至重编译来保证性能最佳

场景：执行var a = 2 ;
1.编译器先将其分解成词法单元并解析成AST树
2.代码生成阶段编译器的处理：
遇到var a ; 编译器问作用域是否已经有同名变量存在在同一作用域，存在则忽略声明，否则要求作用域在当前作用域的集合中
声明一个新的变量a
3.接下来编译器会为引擎生成运行时所需的代码，用来处理a = 2这个赋值操作。引擎运行时会首先询问当前作用域是否存在a变量
存在引擎则会引用这个变量不存在继续查找，最终找到就赋值，找不到抛出异常

总结就是编译器处理声明，引擎处理赋值

LHS引用：a = 2这种，意为2赋值操作的目标是谁（a）
RHS引用：console.log(a),谁是赋值操作的源头(console.log(...))

function foo(a){
console.log(a) ;
}
foo(2) ;
1.引擎从作用域拿到对foo的RHS引用并执行foo(...)
2.引擎从作用域拿到对a的LHS引用并赋值a = 2 ;
3.引擎从作用域拿到对console的RHS引用并找其中的log(...)函数
4.引擎从作用域拿到对a的RHS引用确认一下并把a = 2传入log(...)函数并执行

LHS和RHS查询都会沿作用域链一直向上找
RHS查询找不到会抛出异常（ReferenceError）
LHS查询找不到严格模式下一样报错，非严格模式下，全局作用域会隐式的声明一个你想赋值变量

*/