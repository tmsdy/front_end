import React, { Fragment } from 'react'
import Home from '../containers/Home'
import Counter from '../containers/Counter'
import Header from '../components/Header'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import routes from "../routes"

let express = require('express')
let app = express()

app.use(express.static('public')) // 设置找服务器上静态文件的默认目录为public

app.get('*', function (req, res) {
    let context = { name: 'feifei' }
    let html = renderToString( // 根据访问地址的req.path来渲染相应的组件
        <StaticRouter context={context} location={req.path}>
            <Fragment>
                <Header />
                <div className="container" style={{ marginTop: 70 }}>
                    {routes}
                </div>
            </Fragment>
        </StaticRouter>
    )
    res.send(`
        <html>
            <head>
                <title>react ssr 项目</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" />
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