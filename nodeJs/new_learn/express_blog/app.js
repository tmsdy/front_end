const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

const app = express();
const ENV = process.env.NODE_ENV

if (ENV !== 'production') {
    app.use(logger('dev'))
} else {
    const logFileName = path.join(__dirname, 'logs', 'access.log')
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    })
    app.use(logger('combined', {
        // stream: process.stdout //默认的标准输入输出，就是输出在控制台
        stream: writeStream
    }))
}

app.use(express.json()); //对应getPostData实现，解析application/json的
app.use(express.urlencoded({ extended: false })); //解析x-www-form-urlencoded格式的
app.use(cookieParser()); //对应解析cookie实现

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
    client: redisClient
})
app.use(session({ //设置完每次请求都session了
    secret: 'Faa710#',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // path: '/', //前端每个路由都能访问到,默认配置
        // httpOnly: true, //默认配置
        maxAge: 24 * 60 * 60 * 1000
    },
    store: sessionStore //有了store，session会存到redis中去
}))

app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
