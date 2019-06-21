
function _Vue(options = {}) {
    this.$options = options

    var data = this._data = this.$options.data

    for(let key in data) {
        proxy(this, "_data", key);
    }
    observe(data)
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