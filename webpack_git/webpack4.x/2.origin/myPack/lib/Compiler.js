const {
    SyncHook
} = require('tapable')
export default class Compiler extends Tapable {
    constructor(options) {
        super();
        this.options = options
        this.hooks = {
            entryOption: new SyncHook(["config"]),
            afterPlugins: new SyncHook(["compiler"]),
        }
        let plugins = options.plugins
        plugins.forEach(plugin => {
            plugin.apply(this)
        })
        this.hooks.afterPlugins.call() // 触发插件挂载完成事件
    }

    run() { // 找入口文件进行编译

    }
}