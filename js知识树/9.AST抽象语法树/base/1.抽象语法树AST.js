/*

能干嘛？
1）代码语法检查、错误提示、自动补全等
2）代码混淆压缩，去掉换行回车
3）优化代码打包工具webpack等
4）CommonJs、AMD、CMD等代码规范之间的转换
5）TS、JSX转化为原生的JS,学会了可以写很多自定义的插件

上述转换的原理：通过JS Parser把全部的JS代码转化成一颗AST树，我们只需操作AST就行

JS Parser：
1）esprima：比较常用
2）acorn：webpack用的

var name = "feifei"
解析成AST：
{
    type: "Program", //类型是个代码程序
    body: [ //每个分号结尾前都算一个代码体
        {
            type: "VariableDeclarator", //变量声明
            id: {
                type: "Identifier", //标识符 变量
                name: "name", //变量名
            },
            init: { //初始化赋值
                type: "literal", //字面量
                value: "feifei", //值
                raw: "\"is tree\""
            }
        }
    ]
}

*/