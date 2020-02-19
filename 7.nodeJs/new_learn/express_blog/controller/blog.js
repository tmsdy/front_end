const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = (author, title) => {
    let sql = `select * from blogs where 1=1 ` //用where 1=1防止后面sql拼接可能出错
    if (author) {
        sql += `and author='${author}' `
    }
    if (title) {
        sql += `and title like '%${title}%' `
    }
    sql += `order by createtime desc;`
    return exec(sql)
}

const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}';`
    return exec(sql).then(rows => rows[0]) //就算查一个返回的也是数组
}

const newBlog = (blogData = {}) => {
    let title = xss(blogData.title)
    let content = xss(blogData.content)
    const author = xss(blogData.author)
    const createTime = Date.now()
    const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', ${createTime}, '${author}');
`
    return exec(sql).then(result => {
        console.log('result:', result)
        return {
            id: result.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    const { title, content } = blogData
    let sql = `
        update blogs set title='${title}',content='${content}' where id='${id}'
    `
    return exec(sql).then(res => {
        return res.affectedRows > 0
    })
}

const deleteBlog = (id, author) => {
    let sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(res => {
        return res.affectedRows > 0
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}