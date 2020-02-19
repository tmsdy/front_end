class AsyncSeriesWaterfallHook {
    constructor() {
        this.hooks = []
    }
    tapAsync(name, fn) {
        this.hooks.push(fn)
    }
    callAsync() {
        let args = [...arguments]
        let done = args.pop()
        let idx = 0
        let result
        let next = (res) => {
            let fn = this.hooks[idx++]
            if (res) {
                result = res
                fn ? fn(res, next) : done()
            } else {
                fn ? (
                    result ? fn(result, next) : fn(...args, next)
                ) : done()
            }
        }
        next()
    }
}
let beforeRun = new AsyncSeriesWaterfallHook(['compiler'])
console.time('cost')
beforeRun.tapAsync('1', (compilation, callback) => {
    setTimeout(() => {
        console.log(1, compilation)
        callback('aaa')
    }, 1000);
})
beforeRun.tapAsync('2', (compilation, callback) => {
    setTimeout(() => {
        console.log(2, compilation)
        callback()
    }, 2000);
})
beforeRun.tapAsync('3', (compilation, callback) => {
    setTimeout(() => {
        console.log(3, compilation)
        callback()
    }, 3000);
})
beforeRun.callAsync('compilation', () => {
    console.timeEnd('cost') // 6020ms
    console.log('完成了')
})