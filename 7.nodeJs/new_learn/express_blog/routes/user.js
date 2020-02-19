var express = require('express');
var router = express.Router();
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', function (req, res, next) {
    const { username, password } = req.body
    let result = login(username, password)
    return result.then(result => {
        console.log(result)
        if (result.username) {
            // 设置 session, 有了express-session会自动同步到redis中
            req.session.username = result.username
            req.session.realname = result.realname
            res.json(new SuccessModel('登录成功'))
            return
        }
        res.json(new ErrorModel('登录失败'))
    })
});

router.get('/login-test', (req, res, next) => {
    if (req.session.username) {
        res.json({
            error: 0,
            msg: '已登录'
        })
        return
    }
    res.json({
        error: -1,
        msg: '未登录'
    })
})


module.exports = router;
