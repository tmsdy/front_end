const querystring = require('querystring')
const blogRouter = require('./src/router/blog')
const userRouter = require('./src/router/user')

const SESSION_DATA = {}
// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('toGMTString:', d.toGMTString())
    return d.toGMTString()
}

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

const serverHandle = (req, res) => { //所有的http请求都会经过这儿
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    const urlArr = req.url.split('?')
    req.path = urlArr[0] // 获取path
    req.query = querystring.parse(urlArr[1]) //解析query
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) return
        const arr = item.split('=')
        const key = arr[0].trim() // cookie之间有空格的
        const val = arr[1]
        req.cookie[key] = val
    })
    // 解析session
    let needSetCookie = false
    let uid = req.cookie.uid
    if (uid) {
        if (!SESSION_DATA[uid]) {
            SESSION_DATA[uid] = {}
        }
        req.session = SESSION_DATA[uid]
    } else {
        needSetCookie = true
        uid = `${Date.now()}_${Math.random()}`
        SESSION_DATA[uid] = {}
    }
    req.session = SESSION_DATA[uid]

    getPostData(req).then(postData => {
        req.body = postData
        // 处理 blog 路由
        let blogResult = blogRouter(req, res)
        if (blogResult) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `uid=${uid}; path=/; httpOnly;expires=${getCookieExpires()} `)
            }
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        // 处理 user 路由
        const userResult = userRouter(req, res)
        if (userResult) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `uid=${uid}; path=/; httpOnly;expires=${getCookieExpires()} `)
            }
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中路由，返回404
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 Not Found\n")
        res.end()
    })

}

module.exports = serverHandle