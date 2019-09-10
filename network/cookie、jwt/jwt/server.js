const express = require("express")
const app = express();
const auth = require('./auth')
const { User } = require("./model")
const { secret } = require('./config')
const jwt = require('jwt-simple')
const moment = require('moment')

const bodyParser = require("body-parser");
//把表单格式(application/www-form-urlencoded)的请求体字符串转成一个对象赋给req.body 
app.use(bodyParser.urlencoded({ extend: true }))
//把JSON格式(application/json)的请求体字符串转成一个对象赋给req.body 
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Max-Age', '1000')
    next()
})

app.post("/signup", async function (req, res) {//注册
    let user = req.body //{username,password}
    let doc = await User.create(user) //返回保存成功之后的文档对象
    res.json({
        code: 0, //0表示成功，非0表示失败
        data: {
            user: {
                id: doc._id,
                username: doc.username
            }
        }
    })
});
app.post("/signin", async function (req, res) {//登录
    let user = req.body
    console.log(user)
    let doc = await User.findOne(user)
    if (doc) { //登录成功生成签名token，提供payload，header和声明由库做
        let token = jwt.encode({
            user: {
                id: doc._id,
                username: doc.username
            },
            exp: moment().add(30, 'days').valueOf() //指定过期时间
        }, secret)
        res.json({
            code: 0,
            data: {
                token
            }
        })
    } else {
        res.json({
            code: 1,
            message: '登录失败'
        })
    }
});
app.get("/user", auth, async function (req, res) {//用户
    // console.log(req.user)
    res.json({
        code: 0,
        data: {
            user: req.user
        }
    })
});

app.listen(8080);
