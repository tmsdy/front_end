

let esprima = require('esprima');
let estraverse = require('estraverse');
let escodegen = require('escodegen')

let code = 'function ast(a){ let temp = 0123  }'

let ast = esprima.parse(code)
// console.log(ast)

estraverse.traverse(ast, { //每个节点就是每个{}遍历的时候会有进入出来两次遍历的过程
  enter(node){
    // console.log('enter ',node.type)
    if(node.type === 'Identifier') {
      node.name += '_enter_'
    }
  },
  leave(node){
    // console.log('leave ',node.type)
    if(node.type === 'Identifier') {
      node.name += '_leave'
    }
  }

})

let res = escodegen.generate(ast)

console.log(res) //重新生成后的代码

