
let babel = require('@babel/core'); //babal核心库，实现babel转换引擎的，用来转换代码
let types = require('babel-types'); //可以实现类型判断，生成AST的节点

const code = `const sum = (a,b)=>a+b`;
// path.node  父节点
// path.parentPath 父路径
let transformArrowFunctions = {
    visitor: { // visitor访问者模式，对于某个对象或者一组对象，不同的访问者产生的结果不同，执行操作也不同
        // 如果需要进一次出一次都处理需要写成enter leave形式
        ArrowFunctionExpression: (path, state) => { //只有是ArrowFunctionExpression才会走这儿
            console.log(path.type)
            let node = path.node;
            let id = path.parent.id;
            let params = node.params;
            let body= types.blockStatement([
                types.returnStatement(node.body)
            ]);
            let functionExpression = types.functionExpression(id,params,body,false,false);
            path.replaceWith(functionExpression);
        }
    }
}
// 把es6的code转换成es5的res
const res = babel.transform(code, { //@babel/core具体转换代码靠里面的插件实现
    plugins: [transformArrowFunctions]
});
console.log(res.code);