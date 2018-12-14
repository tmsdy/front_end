const express = require('express') ;
const router = express.Router() ;
const User = require('../models/User') ;
const Category = require('../models/Category') ;
const Content = require('../models/Content') ;

router.use((req,res,next)=>{
   if(!req.userInfo.isAdmin){
       res.send('对不起，只有管理员才可以进入后台管理') ;
       return ;
   }
   next() ;
});
//首页
router.get('/',(req,res,next)=>{
   res.render('admin/index',{
       userInfo:req.userInfo
   }) ;
});
//用户管理
router.get('/user',(req,res)=>{
    /*
    * 从数据库获取所有的用户数据:
    * 1.limit(Number):限制获取的数据条数
    * 2.skip(2) :忽略数据的条数
    * */
    let page = Number(req.query.page || 1) ;
    let pageAll = [] ;
    let pages = 0 ;
    let limit = 3 ;

    User.count().then(count=>{
        pages = Math.ceil(count/limit) ;
        page = Math.min(page,pages) ;//page取值不能超过pages
        page = Math.max(page,1) ;//page取值不能小于1
        let skip = (page-1)*limit ;

        for(let i=0;i<pages;i++){
            pageAll.push(i+1) ;
        }

        User.find().limit(limit).skip(skip).then(users=>{
            res.render('admin/user_index',{userInfo:req.userInfo, users, page, pageAll, pages, count, limit}) ;
        }) ;
    });

});

//分类管理
router.get('/category',(req,res)=>{
    let page = Number(req.query.page || 1) ;
    let pageAll = [] ;
    let pages = 0 ;
    let limit = 3 ;

    Category.count().then(count=>{
        pages = Math.ceil(count/limit) ;
        page = Math.min(page,pages) ;//page取值不能超过pages
        page = Math.max(page,1) ;//page取值不能小于1
        let skip = (page-1)*limit ;

        for(let i=0;i<pages;i++){
            pageAll.push(i+1) ;
        }
        //找到数据并排序，1是升序，2是降序,新生成的id较大，采用降序排
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(categories=>{
            res.render('admin/category_index',{userInfo:req.userInfo, categories, page, pageAll, pages, count, limit}) ;
        }) ;
    });

});
//添加分类
router.get('/category/add',(req,res)=>{

    res.render('admin/category_add',{userInfo:req.userInfo,});

});
//分类的保存
router.post('/category/add',(req,res)=>{

    let name = req.body.name||'' ;

    if(name==''){ //判断分类名称是否为空
        res.render('admin/error',{userInfo:req.userInfo, message:'名称不能为空'}) ;
        return ;
    }

    Category.findOne({name}).then(rs=>{ //查询数据库中是否有同名分类名称
        if(rs){ //如果有
            res.render('admin/error',{userInfo:req.userInfo, message:'分类已经存在'}) ;
            return Promise.reject() ;
        }else{ //没有的话，保存分类
            return new Category({name}).save() ;
        }
    }).then((newCategory)=>{
        res.render('admin/success',{userInfo:req.userInfo, message:'分类保存成功', url:'/admin/category'});
    })

});

//分类修改
router.get('/category/edit',(req,res)=>{
    //获取要修改的分类的信息，并且用表单的形式展现出来
    let id = req.query.id || '' ;
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(category=>{
        if (!category){
            res.render('admin/error',{userInfo:req.userInfo, message:'分类信息不存在'});
            return Promise.reject();
        }else {
            res.render('admin/category_edit',{userInfo:req.userInfo, category});
        }
    })
});
//分类的编辑
router.post('/category/edit',(req,res)=>{
    let id = req.query.id || '' ;
    let name = req.body.name||'' ;
    Category.findOne({_id:id}).then(category=>{
        if (!category){
            res.render('admin/error',{userInfo:req.userInfo, message:'分类信息不存在'});
            return Promise.reject();
        }else {
            if(name == category.name){//用户没做修改提交
                res.render('admin/success',{userInfo:req.userInfo, message:'修改成功',url:'/admin/category'});
                return Promise.reject();
            }else {
                return Category.findOne({_id: {$ne:id} , name}) ;//找不是当前id并且等于修改值的分类
            }
        }
    }).then(sameCategory=>{
        if(sameCategory){
            res.render('admin/error',{userInfo:req.userInfo, message:'此分类已存在！'});
            return Promise.reject();
        }else {
            return Category.update({_id:id},{name})
        }
    }).then(()=>{
        res.render('admin/success',{userInfo:req.userInfo, message:'修改成功',url:'/admin/category'});
    })

});
//分类的删除
router.get('/category/delete',(req,res)=>{
    let id = req.query.id || '' ;
    Category.remove({_id:id}).then(()=>{
        res.render('admin/success',{userInfo:req.userInfo, message:'删除成功',url:'/admin/category'});
    });

});
//内容首页
router.get('/content',(req,res)=>{
    let page = Number(req.query.page || 1) ;
    let pageAll = [] ;
    let pages = 0 ;
    let limit = 3 ;

    Content.count().then(count=>{
        pages = Math.ceil(count/limit) ;
        page = Math.min(page,pages) ;//page取值不能超过pages
        page = Math.max(page,1) ;//page取值不能小于1
        let skip = (page-1)*limit ;
        for(let i=0;i<pages;i++){
            pageAll.push(i+1) ;
        }
        //populate读取扩展信息
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({addTime: -1}).then(contents=>{
            console.log(contents) ;
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents, page, pageAll, pages, count, limit
            }) ;
        }) ;
    });

});
//内容添加
router.get('/content/add',(req,res)=>{
    Category.find().sort({_id:-1}).then(categories=>{
        res.render('admin/content_add',{userInfo:req.userInfo,categories}) ;
    });
});
//内容保存
router.post('/content/add',(req,res)=>{
    if(req.body.title==''){
        res.render('admin/error',{userInfo:req.userInfo,message:'标题不能为空'}) ;
        return ;
    }
    new Content({
        category : req.body.category ,
        title : req.body.title ,
        description : req.body.description ,
        content : req.body.content,
        user : req.userInfo._id.toString() ,

    }).save().then(rs=>{
        res.render('admin/success',{userInfo:req.userInfo,message:'内容保存成功',url:'/admin/content'})
    })

});
//修改内容
router.get('/content/edit',(req,res)=>{
    let id = req.query.id || '' ;
    //获取要修改的分类信息

    Content.findOne({_id:id}).populate('category').then(content=>{
        if (!content){
            res.render('admin/error',{userInfo:req.userInfo, message:'指定内容不存在'});
            return Promise.reject();
        }else {
            Category.find().sort({_id:-1}).then(categories=>{
                res.render('admin/content_edit',{userInfo:req.userInfo, content,categories});
            });
        }
    })

});

//分类修改
router.post('/content/edit', (req, res)=>{
    let id = req.query.id || '' ;
    if(req.body.title==''){
        res.render('admin/error',{userInfo:req.userInfo,message:'标题不能为空'}) ;
        return ;
    }
    Content.update({_id:id},{
        category:req.body.category ,
        title:req.body.title ,
        description : req.body.description ,
        content : req.body.content
    }).then(()=>{
        res.render('admin/success',{userInfo:req.userInfo,message:'内容修改成功',url:'/admin/content/edit?id='+id}) ;
    });
});
//内容删除
router.get('/content/delete',(req,res)=>{
    let id = req.query.id || '' ;
    Content.remove({_id:id}).then(()=>{
        res.render('admin/success',{userInfo:req.userInfo, message:'删除成功',url:'/admin/content'});
    });
});

module.exports = router ;