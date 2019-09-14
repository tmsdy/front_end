const querystring = require('querystring')
const blogRouter = require('./src/router/blog')
const userRouter = require('./src/router/user')
const { access } = require('./src/utils/log')
const { get, set } = require('./src/db/redis')

// const SESSION_DATA = {}
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
        req.on('data', chunk => { // 网络IO
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
    // 记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    const urlArr = req.url.split('?')
    req.path = urlArr[0] // 获取path
    req.query = querystring.parse(urlArr[1]) //解析query
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    // console.log(cookieStr) //uid=1568185382743_0.5435564294573281; language=zh-cn; timezone=+8
    cookieStr.split(';').forEach(item => {
        if (!item) return
        const arr = item.split('=')
        const key = arr[0].trim() // cookie之间有空格的
        const val = arr[1]
        req.cookie[key] = val
    })
    // 解析session
    // let needSetCookie = false
    // let uid = req.cookie.uid
    // if (uid) {
    //     if (!SESSION_DATA[uid]) {
    //         SESSION_DATA[uid] = {}
    //     }
    //     req.session = SESSION_DATA[uid]
    // } else {
    //     needSetCookie = true
    //     uid = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[uid] = {}
    // }
    // req.session = SESSION_DATA[uid]

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.uid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        console.log('req.session ', req.session)

        // 处理 post data
        return getPostData(req)
    }).then(postData => {
        req.body = postData
        // 处理 blog 路由
        let blogResult = blogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `uid=${userId}; path=/; httpOnly;expires=${getCookieExpires()} `)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        // 处理 user 路由
        const userResult = userRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `uid=${userId}; path=/; httpOnly;expires=${getCookieExpires()} `)
                }
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