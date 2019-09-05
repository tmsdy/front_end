const {
    loginCheck
} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const userRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        let result = loginCheck(username, password)
        if (result) {
            return new SuccessModel('登录成功')
        } else {
            return new ErrorModel('登录失败')
        }
    }
}

module.exports = userRouter