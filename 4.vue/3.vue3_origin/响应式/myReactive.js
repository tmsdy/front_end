
let obj = {
    name: 'feifei',
    location: {
        city: 'beijing'
    }
}
let arr = [1, 2, 3, 4, 5]
let proxyArr = reactive(arr)
let proxyObj = reactive(obj)

function reactive(_target) {
    return new Proxy(_target, {
        get(target, key) {
            console.log('获取值', key)
            // return target[key]
            return Reflect.get(target, key)
        },
        set(target, key, val) {
            console.log('修改值', key, val)
            return Reflect.set(target, key, val)
        }
    })
}

// 1.修改对象 -> 对象嵌套
proxyObj.name = 'lulu'
console.log(proxyObj)
// proxyObj.location.city = 'shanghai'
// console.log(proxyObj.location.city)

// 2.修改数组 -> 数组会触发多次
// proxyArr.shift()
// proxyArr.unshift()
