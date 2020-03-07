import React from 'react'
import Home from '../containers/Home'
import Counter from '../containers/Counter'
import { renderToString } from 'react-dom/server'
let express = require('express')
let app = express()

app.use(express.static('public')) // 设置找服务器上静态文件的默认目录为public

app.get('/', function (req, res) {
    let html = renderToString(<Counter />)
    res.send(`
        <html>
            <head>
                <title>react ssr 项目</title>
            </head>
            <body>
                <div id='root'>${html}</div>
                <script src="/client.js"></script>
            </body>
        </html>
    `)
})


app.listen(3000, () => {
    console.log('server is listening 3000')
})