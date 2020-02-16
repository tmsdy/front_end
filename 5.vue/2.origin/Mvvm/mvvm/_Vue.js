import { getType, proxy } from './utils'
import Watcher from './Watcher'
import Dep from './Dep'
function _Vue(options = {}) {
    this.$options = options

    var data = this._data = this.$options.data

    for (let key in data) {
        proxy(this, "_data", key)
    }
    observe(data)
    new Compile(options.el, this)
}

function Compile(el, vm) {
    let child
    // el表示需要替换的元素
    vm.$el = document.querySelector(el)
    let fragment = document.createDocumentFragment()
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child) // 将app中的内容移到内存中操作
    }
    replace(fragment)

    function replace(fragment) { // 遍历dom替换内容
        // console.log(fragment)
        Array.from(fragment.childNodes).forEach(function (node) {
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/
            if (node.nodeType === 3 && reg.test(text)) { //是文本节点并且有双大括号
                // console.log(RegExp.$1) a.a b
                let arr = RegExp.$1.split('.') // [a,a]
                let val = vm
                arr.forEach(function (k) { //取vm.a.a的一个小技巧
                    val = val[k]
                })
                new Watcher(vm, RegExp.$1, function (newVal) {
                    node.textContent = text.replace(reg, newVal)
                })
                node.textContent = text.replace(reg, val)
            }
            if (node.childNodes) {
                replace(node)
            }
        })
    }

    vm.$el.appendChild(fragment)
}

function observe(data) { //使得data变为响应式，只对对象和数组做响应式，基本数据类型不做
    // console.log('observe', getType(data))
    if (getType(data) !== 'object') return
    return new Observer(data)
}

function Observer(data) { //写主要逻辑
    let dep = new Dep()
    // console.log('Observer')
    for (let key in data) {
        let val = data[key]
        observe(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() { // vue.a.a会走两次
                // console.log('Dep target=', Dep.target)
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newVal) {
                if (val === newVal) return
                val = newVal // 新值赋给旧值，由于闭包对val持有，在走get获取到的就是新值了
                observe(newVal) // 因为是数组或者对象是引用类型所以可以这么搞
                console.log(dep)
                // dep.notify()
            }
        })
    }
}

export default _Vue



