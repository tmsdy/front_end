/*

怎样欺骗(修改)词法作用域呢？ 尽量别搞，降低性能的

eval(...)函数：接收一个字符串
    写在一个地方就代表你的代码是写在那地方的,严格模式下欺骗不了
    function foo(str,a){
        eval(str) ; //欺骗
        console.log(a,b) ;
    }
    var b = 2 ;
    foo("var b=3 ;" , 1) ;// 1,3

with(...)函数：...

*/