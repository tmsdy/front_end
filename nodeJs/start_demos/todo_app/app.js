var express = require('express') ;
var todo_controller = require('./controller/todoController') ;

var app = express() ;

app.set('view engine' , 'ejs') ;
app.use(express.static('./public')) ;

todo_controller(app) ;

app.listen(3000) ;