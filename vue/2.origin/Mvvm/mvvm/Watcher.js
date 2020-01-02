import Dep from "./Dep"

export default class Watcher {
    constructor(vm, exp, fn) {
        this.vm = vm
        this.exp = exp
        this.fn = fn
        Dep.target = this
        let val = vm
        let arr = exp.split('.')
        arr.forEach(k => { // this.a.a
            val = val[k]
        })
        Dep.target = null
    }

    update() {
        let val = this.vm
        let arr = this.exp.split('.')
        arr.forEach(k => {
            val = val[k]
        })
        this.fn(val)
    }

}