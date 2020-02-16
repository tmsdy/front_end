class Dep {
    constructor(name) {
        this.name = name
        this.subs = []
    }
    addDep(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(item => item.update())
    }
}

class Watcher {
    constructor(name, dep) {
        this.name = name
        dep.addDep(this)
    }
    setState() {
        dep.notify()
    }
    update() {
        console.log('update===', this.name)
    }
}

let dep = new Dep()

let w1 = new Watcher('w1', dep)
let w2 = new Watcher('w2', dep)

w1.setState()
w2.setState()
