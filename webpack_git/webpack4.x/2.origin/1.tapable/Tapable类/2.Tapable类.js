/*
1.webpack核心类Compiler、Compilation、ModuleFactory都是继承Tapable类的
它们里面都有this.hooks
*/
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.hooks = {
            beforeRun: new AsyncSeriesHook(["compiler"])
            // ...
        }
    }
}
class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.hooks = {
            buildModule: new SyncHook(["module"])
            // ...
        }
    }
}
class NormalModuleFactory extends Tapable {
    constructor(context, resolverFactory, options) {
        super();
        this.hooks = {
            resolver: new SyncWaterfallHook(["resolver"]),
            factory: new SyncWaterfallHook(["factory"]),
            // ...
        }
    }
}