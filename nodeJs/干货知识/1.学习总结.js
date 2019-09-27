/*

1.cookieParser原理：
从请求中拿到req.headers.cookie是这样：
'uid=1568185382743_0.5435564294573281; language=zh-cn; timezone=+8'
cookieParser利用字符串的split方法实现了给req.cookies.uid =赋值1568185382743_0.5435564294573281，这样就能在req.cookies取到传过来的cookie了

2.app.use(express.json())原理：
做的事情是利用
req.on('data', chunk => { ... 累积请求body传的东西})
req.on('end', () => { ... 把累积完的请求body东西赋值到req.body上})




*/