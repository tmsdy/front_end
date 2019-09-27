import Vue from 'vue'
import App from './src/app.vue'

let formatStack = (stack) => {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/) //报错url和报错位置
    // console.log(matchUrl)
    let urlFirstStack = matchUrl ? matchUrl[0] : ''
    let regUrlCheck = /https?:\/\/(\S)*\.js/

    let resourceUrl = '' //报错url
    if (regUrlCheck.test(urlFirstStack)) {
        resourceUrl = urlFirstStack.match(regUrlCheck)[0]
    }

    let stackCol = null //报错信息列
    let stackRow = null //报错信息行
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/)
    if (posStack && posStack.length >= 3) {
        [, stackCol, stackRow] = posStack
    }
    return {
        resourceUrl,
        stackCol,
        stackRow
    }
}
Vue.config.errorHandler = (err, vm, info) => {
    let stack = err.stack
    let { resourceUrl, stackCol, stackRow } = formatStack(stack)
    console.log(resourceUrl, stackCol, stackRow)
    console.log(stack)
    // console.log(vm)
    console.log(info)
}

new Vue({
    el: '#app',
    render: (h) => h(App)
})