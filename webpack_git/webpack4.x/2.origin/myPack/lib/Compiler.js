const { SyncHook } = require('tapable')
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

class Compiler {
    constructor(options) {
        // super();
        this.options = options
        this.hooks = {
            entryOption: new SyncHook(["config"]),
            afterPlugins: new SyncHook(["compiler"]),
            run: new SyncHook(["config"]),
            compile: new SyncHook(["config"]),
            afterCompile: new SyncHook(["config"]),
            emit: new SyncHook(["config"]),
            done: new SyncHook(["config"]),
        }
        let plugins = options.plugins
        if (options.plugins && Array.isArray(options.plugins)) {
            plugins.forEach(plugin => {
                plugin.apply(this)
            })
        }
        this.hooks.afterPlugins.call() // 触发插件挂载完成事件
    }

    run() { // 找入口文件进行编译
        this.hooks.run.call(this)
        let {
            entry,
            output: { path: dist, filename },
            resolveLoader: { modules: loaderPath },
            module: { rules }
        } = this.options
        let modules = {} // 存所有的模块key-value对应 moduleId 源代码
        let root = process.cwd() // 根目录
        let entryPath = path.join(root, entry)
        let entryId

        this.hooks.compile.call(this)
        parseModule(entryPath, true)

        this.hooks.afterCompile.call(this)

        let bundle = ejs.compile(fs.readFileSync(path.join(__dirname, 'main.ejs'), 'utf8'))({
            modules,
            entryId
        })
        this.hooks.emit.call(this)
        fs.writeFileSync(path.join(dist, filename), bundle)
        this.hooks.done.call(this)

        function parseModule(modulePath, isEntry) {
            let source = fs.readFileSync(modulePath, 'utf8') // 入口文件转成utf8的字符串
            let relativePath = path.relative(root, modulePath) // src/index.js
            let parentPath = path.dirname(relativePath) // src

            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i]
                if (rule.test.test(modulePath)) {
                    let loaders = rule.use || rule.loader
                    if (Array.isArray(loaders)) {
                        for (let j = loaders.length - 1; j >= 0; j--) { // 从后向前执行
                            let loader = loaders[j]
                            loader = require(path.join(root, loaderPath, loader))
                            source = loader(source)
                        }
                    } else if (typeof loader === 'string') {

                    } else if (typeof loader === 'object') {
                        loader = loaders.loader
                    }
                }
            }

            let result = parse(source, parentPath) //解析模块内容，并且返回依赖的模块
            modules['./' + relativePath] = result.source
            if (isEntry) {
                entryId = './' + relativePath
            }
            if (result.dependencies && result.dependencies.length > 0) {
                result.dependencies.forEach(item => {
                    let requirePath = path.join(root, item)
                    parseModule(requirePath, false) // 深度优先遍历
                })
            }
        }
        function parse(source, parentPath) {
            let _ast = esprima.parse(source) // 生成ast
            let dependencies = [] // 依赖的数组
            estraverse.replace(_ast, {
                enter(node, parent) {
                    if (node.type === 'CallExpression' && node.callee.name === 'require') {
                        let name = node.arguments[0].value // require写的引入路径
                        name += (name.lastIndexOf('.') > 0 ? '' : '.js') // 处理路径后缀
                        let moduleId = './' + path.join(parentPath, name)
                        dependencies.push(moduleId)
                        node.callee.name = '__webpack_require__'
                        node.arguments = [{ type: 'Literal', value: moduleId }]
                        console.log(moduleId)
                        return node // 返回修改后的node节点
                    }
                }
            })
            source = escodegen.generate(_ast) // 生成转换后的代码
            return {
                dependencies,
                source
            }
        }
    }
}

module.exports = Compiler