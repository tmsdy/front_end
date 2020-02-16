let babel = require('@babel/core');
let types = require('babel-types');

/*
预计算：js引擎计算这种多个数的加减乘除耗费时间，可以在打包的时候预计算好
*/
const code = `const res = 1000*60*60*24*365 `

const preCalcPlugin = {
    visitor: {
        BinaryExpression:(path,state)=>{
            let node = path.node
            let operator = node.operator
            let leftVal = node.left.value
            let rightVal = node.right.value
            if(!isNaN(leftVal) && !isNaN(rightVal)){ //如果这两都是数字的话
                let result = eval(leftVal+operator+rightVal)
                path.replaceWith(types.numericLiteral(result))
                console.log(leftVal,rightVal)
                if (path.parent && path.parent.type === 'BinaryExpression') {
                    preCalcPlugin.visitor.BinaryExpression.call(null,path.parentPath);
                }
            }
        }
    }
}

const res = babel.transform(code, { //@babel/core具体转换代码靠里面的插件实现
    plugins: [preCalcPlugin]
});
console.log(res.code);

