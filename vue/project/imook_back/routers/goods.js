const express = require('express') ;
const router = express.Router() ;
const Goods = require('../models/Goods') ;
const Users = require('../models/Users') ;

//统一返回格式
var resData ;
router.use((req,res,next)=>{
    resData = {
        code : 0 ,
        message : ''
    };
    next() ;
});

//查询商品列表数据
router.get('/list',(req,res,next)=>{
    let page = parseInt(req.param("page")) ;
    let pageSize = parseInt(req.param("pageSize")) ;
    let priceLevel = req.param("priceLevel") ;
    let sort = parseInt(req.param("sort")) ;
    let skip = (page-1)*pageSize ;
    let params = {} ;
    let priceGt=0,priceLte=0 ;
    if(priceLevel!='all'){ //过滤价格范围的商品
        switch(priceLevel){
            case '0' :  priceGt=0;priceLte=100;break ;
            case '1' :  priceGt=100;priceLte=500;break ;
            case '2' :  priceGt=500;priceLte=2000;break ;
            case '3' :  priceGt=2000;priceLte=99999999;break ;
        }
        params.productPrice = {
            $gt:priceGt,
            $lte:priceLte
        }
    }
    
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize) ;

    goodsModel.sort({'productPrice':sort}) ;
    goodsModel.exec((err,goods)=>{ //分页和排序后的商品数据
       if(goods){
            resData.message = "获取商品列表成功！" ;
            resData.data = goods ;
            res.json(resData) ;
       }
    })
    
});
//查询购物车商品数量
router.get('/getCartCount',(req,res,next)=>{
    let userInfo = JSON.parse(req.cookies.userInfo) ;
    let user_id = userInfo.user_id ;
    if(userInfo && userInfo.user_id){
        Users.findOne({user_id},(err,doc)=>{
            if(err){
                resData.code = 1 ;
                resData.message = "查询失败" ;
                res.json(resData) ;
            }else{
                let cart_list = doc.cart_list ;
                let cartCount = 0 ;
                cart_list.map(item=>{
                    cartCount = item.productNum ;
                })
                resData.message = '查询成功！' ;
                resData.cartCount = cartCount ;
                res.json(resData) ;
            }
        })
    }
})
//加入购物车
router.post('/addCart',(req,res,next)=>{
    let user_id = JSON.parse(req.cookies.userInfo).user_id ;
    let productId = req.body.productId ;
    Users.findOne({user_id}).then((user)=>{     
            if(user){
                let goods_item = '' ;
                user.cart_list.forEach(item => {
                    if(item.productId == productId){
                        goods_item = item ;
                        item.productNum++ ; //这里数量已经加1了
                    }
                });
                if(goods_item){
                    user.save((err,doc)=>{
                        if(doc){
                            res.json({
                                status: 0 ,
                                msg:'保存成功'
                            })
                        }
                    }) ;
                }else{
                    Goods.findOne({productId},(err,goods)=>{
                        if(goods){
                            goods.productNum = 1 ;
                            goods.checked = true ;
                            user.cart_list.push(goods) ;
                            user.save((err,doc)=>{
                                // console.log(doc) ;
                                if(doc){
                                    res.json({
                                        status: 0 ,
                                        msg:'保存成功'
                                    })
                                }
                            }) ;
                        }
    
                    })
                }
                
            }
        
    })
});

//购物车的删除
router.post("/cart/del",(req,res,next)=>{
    let user_id = JSON.parse(req.cookies.userInfo).user_id ;
    let productId = req.body.productId ;
    Users.update({user_id},{
        $pull:{
            cart_list:{productId}
        }
    },(err,doc)=>{
        if(err){
            resData.code = 1 ;
            resData.message = '删除失败！' ;
        }else{
            resData.message = '删除购物车商品成功！' ;
        }
        res.json(resData) ;
    })

})

//购物车商品数量编辑
router.post('/cartEdit',(req,res,next)=>{
    let user_id = JSON.parse(req.cookies.userInfo).user_id ;
    let productId = req.body.productId ;
    let productNum = req.body.productNum ;
    let checked = req.body.checked ;
    Users.update({user_id,'cart_list.productId':productId},{ //更新子级数据
        'cart_list.$.productNum':productNum ,
        'cart_list.$.checked':checked ,
    },(err,doc)=>{
        if(err){
            resData.code = 1 ;
            resData.message = '商品信息编辑失败！' ;
        }else{
            resData.message = '商品信息编辑成功！' ;
        }
        res.json(resData) ;
    })
})
// 商品全选编辑
router.post("/editCheckAll",(req,res,next)=>{
    let user_id = JSON.parse(req.cookies.userInfo).user_id ;
    let checkAll = req.body.checkAll ;
    Users.findOne({user_id},(err,user)=>{
        if(err){
            resData.code = 1 ;
            resData.message = '商品信息编辑失败！' ;
            res.json(resData) ;
        }else{
            if(user){
                user.cart_list.forEach((item)=>{
                    item.checked = checkAll ;
                })
                user.save((err1,doc)=>{
                    if(err1){
                        resData.code = 1 ;
                        resData.message = '商品信息编辑失败！' ;
                    }else{
                        resData.message = '商品信息编辑成功！' ;
                    }
                    res.json(resData) ;
                })
            }
        }
        
    })
})

  module.exports = router 