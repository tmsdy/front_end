const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const blogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const title = req.query.title || ''
        return getList(author, title).then(list => {
            // console.log('list:', list)
            return new SuccessModel(list)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return getDetail(id).then(blogItem => {
            console.log('blogItem:', blogItem)
            return new SuccessModel(blogItem)
        })
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/newblog') {
        let loginCheckRes = loginCheck(req)
        if (loginCheckRes) {
            return loginCheckRes
        }
        req.body.author = req.session.username
        return newBlog(req.body).then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        let loginCheckRes = loginCheck(req)
        if (loginCheckRes) {
            return loginCheckRes
        }
        const result = updateBlog(id, req.body)
        return result.then(val => { // 要写return里面的return才生效
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        let loginCheckRes = loginCheck(req)
        if (loginCheckRes) {
            return loginCheckRes
        }
        const author = req.session.username
        const result = deleteBlog(id, author)
        return result.then(res => {
            return res ? new SuccessModel() : new ErrorModel('删除博客失败')
        })
    }
}

module.exports = blogRouter