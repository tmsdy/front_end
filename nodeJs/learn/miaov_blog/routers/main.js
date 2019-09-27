const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Content = require('../models/Content');
var data;
//处理通用数据
router.use((req, res, next) => {
    console.log('main的通用')
    data = {
        userInfo: req.userInfo,
        categories: [],
    };
    Category.find().then(categories => {
        data.categories = categories;
        next();
    })
});

//首页
router.get('/', (req, res, next) => {
    console.log('main的/')
    data = {
        ...{
            category: req.query.category || '',
            count: 0,
            page: Number(req.query.page || 1),
            pageAll: [],
            pages: 0,
            limit: 3
        }, ...data
    };
    let where = {};
    if (data.category) {
        where.category = data.category;
    }

    Content.where(where).count().then((count) => {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);//page取值不能超过pages
        data.page = Math.max(data.page, 1);//page取值不能小于1
        let skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({ addTime: -1 });
    }).then((contents) => {
        data.contents = contents;
        res.render('main/index', data);
    })

});

router.get('/view', (req, res) => {
    let contentId = req.query.contentid || '';

    Content.findOne({ _id: contentId }).then((content) => {
        data.content = content;
        // data.content.views++ ; //这样并不能改变浏览数(还有问题)
        content.views++;//这样才行，先加再save
        content.save();
        res.render('main/view', data);
    });

});

module.exports = router;