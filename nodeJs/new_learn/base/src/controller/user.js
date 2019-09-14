const { exec } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
    username = escape(username)
    password = escape(password)
    // 生成加密密码
    password = genPassword(password)
    const sql = `
        select username, realname from users where username='${username}' and password='${password}'
    `
    console.log('sql:', sql)
    return exec(sql).then(rows => rows[0])
}

module.exports = {
    login
}