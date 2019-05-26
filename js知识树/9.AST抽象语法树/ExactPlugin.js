let babel = require('babel-core')
let types = require('babel-types')

const code = `import {flatten,cloneDeep} from 'lodash'`

const ImportSplitPlugin = {
    visitor: {
        ImportDeclaration(path,ref){
            let node = path.node
            let specifiers = node.specifiers
            // console.log(specifiers)
            // if(ref.opts.library == node.source.value && !types.isImportDefaultSpecifier(specifiers[0])){
            if(!types.isImportDefaultSpecifier(specifiers[0])){
                let newImports = specifiers.map(specifier =>
                    types.importDeclaration([types.ImportDefaultSpecifier(specifier.local)], 
                    types.stringLiteral(`${node.source.value}/${specifier.local.name}`))
                )
                console.log(newImports)
                path.replaceWithMultiple(newImports) //多行替换一行
            }
        }
    }
}

const res = babel.transform(code, { 
    plugins: [ImportSplitPlugin]
});
console.log(res.code);