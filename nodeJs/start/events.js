var events = require('events') ; //引入事件模块

var myEmitter = new events.EventEmitter() ; //创建EventEmitter对象

myEmitter.on('my_event01', (name)=> {//注册事件-同步-加不加箭头会影响this指向
    console.log("我的注册事件01,姓名："+name)
})
myEmitter.emit('my_event01','feifei') ;

myEmitter.on('my_event02', (age)=> {//注册事件-异步
    setImmediate(() => {
        console.log("我的注册事件02，年龄："+age)
    });
});
myEmitter.emit('my_event02',20) ;
console.log('111') ;