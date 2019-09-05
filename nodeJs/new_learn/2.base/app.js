const querystring = require('querystring')
const blogRouter = require('./src/router/blog')
const userRouter = require('./src/router/user')

// 用Promise处理 post data
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if ((req.method !== 'POST') || (req.headers['content-type'] !== 'application/json')) {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    const urlArr = req.url.split('?')
    req.path = urlArr[0]
    req.query = querystring.parse(urlArr[1])
    getPostData(req).then(postData => {
        req.body = postData
        // 处理 blog 路由
        const blogData = blogRouter(req, res)
        console.log(blogData)
        if (blogData) {
            res.end(
                JSON.stringify(blogData)
            )
            return
        }
        // 处理 user 路由
        const userData = userRouter(req, res)
        if (userData) {
            res.end(
                JSON.stringify(userData)
            )
            return
        }

        // 未命中路由，返回404
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 Not Found\n")
        res.end()
    })

}

module.exports = serverHandle