const express = require('express');
const router = express.Router();
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', function (req, res, next) {
    let author = req.query.username || ''
    let title = req.query.title || ''
    if (req.query.isadmin) {
        if (req.session.username === null) {
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        author = req.session.username
    }
    return getList(author, title).then(list => {
        res.json(new SuccessModel(list))
    })
});

router.get('/detail', function (req, res, next) {
    return getDetail(req.query.id).then(blogItem => {
        res.json(new SuccessModel(blogItem))
    })
});

router.post('/newblog', loginCheck, function (req, res, next) {
    req.body.author = req.session.username
    return newBlog(req.body).then(data => {
        res.json(new SuccessModel(data))
    })
})

router.post('/update', loginCheck, function (req, res, next) {
    let result = updateBlog(req.query.id, req.body)
    return result.then(val => {
        res.json(
            val ? new SuccessModel() : new ErrorModel('更新博客失败')
        )
    })
})

router.post('/del', loginCheck, function (req, res, next) {
    let author = req.session.username
    let result = deleteBlog(req.query.id, author)
    return result.then(result => {
        res.json(
            result ? new SuccessModel() : new ErrorModel('删除博客失败')
        )
    })
})

module.exports = router;
