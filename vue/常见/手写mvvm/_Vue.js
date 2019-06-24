
function _Vue(options = {}) {
    this.$options = options

    var data = this._data = this.$options.data

    for(let key in data) {
        proxy(this, "_data", key);
    }
    observe(data)
    new Compile(options.el, this)
}

function Compile(el, vm){
    // el表示需要替换的元素
    vm.$el = document.querySelector(el)
    // console.log(vm.$el)
    // 将app中的内容移到内存中
    let fragment = document.createDocumentFragment()
    while(child = vm.$el.firstChild){
        fragment.appendChild(child)
    }
    replace(fragment)
    function replace(fragment) {
        // console.log(fragment)
        Array.from(fragment.childNodes).forEach(function(node){
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/
            if(node.nodeType === 3 && reg.test(text)){ //是文本节点并且有双大括号
                // console.log(RegExp.$1) a.a b
                let arr = RegExp.$1.split('.') // [a,a]
                let val = vm
                arr.forEach(function (k) { //取vm.a.a的一个小技巧
                    val = val[k]
                })
                node.textContent = text.replace(reg, val)
            }
            if(node.childNodes){
                replace(node)
            }
        })
    }
    
    vm.$el.appendChild(fragment)
}

function observe(data) { //使得data变为响应式
    if(!isObject(data)) return
    return new Observer(data)
}

function Observer(data) { //写主要逻辑
    for(let key in data){
        let val = data[key]
        observe(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get(){
                return val
            },
            set(newVal){
                if(val === newVal) return
                val = newVal; //新值赋给旧值，由于闭包对val持有，在走get获取到的就是新值了
                observe(newVal)
            }
        })
    }
}

function proxy (target, sourceKey, key) { 
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
            return this[sourceKey][key]
        },
        set(newVal) {
            this[sourceKey][key] = newVal
        }
    })
}
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object object]'
}