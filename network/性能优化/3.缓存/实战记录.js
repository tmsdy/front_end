/*

1.原生res.writeHead报请求发送完不能写头的错误，res.setHeader却正常
router.get('/getMailCurrent', async (req, res, next) => {
    let returnData = req.app.locals.config.initData()
    try {
        returnData = await Mails.getMailCurrent(req.app.locals)
        res.setHeader('Cache-Control', 'max-age=20000,no-cache'); //正常
    } catch (e) {}
    res.json(returnData)
})

2.返回了etag，再次请求没有带上if-none-match
解决：浏览器取消勾选disable-cache，然后请求的url不能变
https://blog.csdn.net/zlp1992/article/details/78547926

3.可以用md5给资源生成唯一标志，走协商缓存发请求到node层，我怎么知道资源有没有变，我得再发请求然后md5生成etag再比较才知道有没有变。不适合像邮件这种会高频变状态的接口

*/