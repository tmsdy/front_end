class AsyncSeriesBailHook {
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
        let next = (err) => {
            if (err) return done()
            let fn = this.hooks[idx++]
            fn ? fn(...args, next) : done()
        }
        next()
    }
}
let beforeRun = new AsyncSeriesBailHook(['compiler'])
console.time('cost')
beforeRun.tapAsync('1', (compilation, callback) => {
    setTimeout(() => {
        console.log(1, compilation)
        callback('error')
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