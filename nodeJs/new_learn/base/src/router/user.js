const {
    login
} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')



const userRouter = (req, res) => {
    const method = req.method

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        console.log('登录')
        const { username, password } = req.body
        let result = login(username, password)
        return result.then(result => {
            console.log(result)
            if (result.username) {
                req.session.username = result.username
                req.session.realname = result.realname
                return new SuccessModel('登录成功')
            }
            return new ErrorModel('登录失败')
        })
    }
}

module.exports = userRouter