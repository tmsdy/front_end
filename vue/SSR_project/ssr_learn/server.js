let express = require('express')
let fs = require('fs')
let app = express()

let Vue = require('vue')
let VueServerRender = require('vue-server-renderer')

let vm = new Vue({
    template: '<div>hello world</div>'
})

let template = fs.readFileSync('./index.html', 'utf8')

// 创建渲染函数
let render = VueServerRender.createRenderer()

app.get('/', (req, res) => {
    render.renderToString(vm, function (err, html) {
        res.send()
    })
})

app.listen(3000)
