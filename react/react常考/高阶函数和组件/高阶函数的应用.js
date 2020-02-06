// 1.在时间函数中的应用
setTimeout(function(){
    console.log('hello111');
},1000)
setInterval(function(){
    console.log('hello222');
},1000)

// 2.在ajax中的应用
$.get('/api/getTime', function(){
    console.log('请求成功');
})

// 3.数组中的应用
// 数组的some、every、filter、map、forEach方法