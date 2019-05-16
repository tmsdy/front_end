var mongoose = require('mongoose') ;
mongoose.connect('mongodb://todo_app:hf597232@ds123490.mlab.com:23490/todo_rekey',{
    useNewUrlParser: true
}) ;//链接数据库
var  todo_schema = new mongoose.Schema({//创建图表
    item:String,
});
//往数据库中存储数据
var Todo = mongoose.model('Todo',todo_schema) ;

var bodyParser = require('body-parser') ; //对数据解码用的
var urlencode_parser = bodyParser.urlencoded({extended:false}) ;

module.exports = function(app){
    //获取数据
    app.get('/todo', (req,res)=> {
        Todo.find({}, (err,data)=>{
            if(err) throw err ;
            res.render('todo',{todos:data}) ;
        });
    });
    //传递(添加)数据
    app.post('/todo',urlencode_parser, (req,res)=> {
        // console.log(req.body) ; //有数据解码是{item:...},否则是undefined ;
        Todo(req.body).save((err,data)=>{
            if(err) throw err ;
            res.json(data) ;
        }) ;
    });
    //删除数据
    app.delete('/todo/:item', (req,res)=>{
        Todo.find({item:req.params.item}).remove((err,data)=>{
            if(err) throw err ;
            res.json(data) ;
        })
    }) ;
}