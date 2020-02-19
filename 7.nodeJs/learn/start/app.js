var stuff =  require('./my_module/stuff') ;

//路径
console.log(__dirname) ;//不包含文件名的路径
console.log(__filename) ;//包含文件名的路径

let person_list = ["feifei","fangfang","mengmeng"] ;
//模块的方法
console.log(stuff.counter(person_list))  ;
console.log(stuff.adder(3,4)) ;