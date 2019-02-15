import $ from 'jquery' //这样引当然可以的

console.log('index') ;

$('#app').html('飞飞123') ;

require('./index.css') //css不是js模块，需要loader工具转换