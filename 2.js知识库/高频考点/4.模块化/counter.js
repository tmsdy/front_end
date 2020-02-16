let counter = 3
let obj = {
    name: 'aaa'
}

function incCounter() {
    counter++
}

function changeObj() {
    obj.name = 'feifei'
}

module.exports = { // module 是 Node 独有的一个变量
    counter,
    incCounter,
    obj,
    changeObj
};