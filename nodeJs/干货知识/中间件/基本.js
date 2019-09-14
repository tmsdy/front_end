/*
app.use,app.get,app.post里面写一个函数的都是中间件
* 一般情况
app.use((req, res, next) => { // app.use不分get还是post都处理
    console.log('请求开始...', req.method, req.url)
    next()
})

* 标准中间件
function loginCheck(req, res, next) { // 模拟登录验证
    setTimeout(() => {
        console.log('模拟登陆失败')
        res.json({
            errno: -1,
            msg: '登录失败'
        })

        // console.log('模拟登陆成功')
        // next()
    })
}
app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

*/