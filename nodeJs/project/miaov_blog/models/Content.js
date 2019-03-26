let mongoose =require('mongoose') ;
//内容的表结构
let contents_schema = new mongoose.Schema({

    category:{ //关联字段 - 内容分类的id
        type : mongoose.Schema.Types.ObjectId  ,
        ref : 'Category'
    },
    user:{ //用户
        type : mongoose.Schema.Types.ObjectId  ,
        ref : 'User'
    },
    addTime:{ //添加时间
        type : Date  ,
        default : new Date()
    },
    views :{ //浏览量
        type :Number ,
        default : 0
    },
    title : String , //内容标题
    description:{ //简介
        type: String ,
        default : ''
    },
    content: {
        type: String ,
        default: ''
    },
    comments:{
        type : Array ,
        default : []
    }
});

module.exports = mongoose.model('Content',contents_schema) ;