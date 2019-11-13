class Queue {
    constructor() {
        this.PromiseArr = []
    }
    addTask(value, interval) {
        this.PromiseArr.push(
            () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log(value)
                        resolve()
                    }, interval)
                })
            }
        )
        return this
    }
    async start() {
        for (let item of this.PromiseArr) {
            await item()
        }
    }

}
let q = new Queue()
    .addTask('111', 1000)
    .addTask('222', 3000)
    .addTask('333', 2000)

setTimeout(() => {
    q.start()
}, 2000)