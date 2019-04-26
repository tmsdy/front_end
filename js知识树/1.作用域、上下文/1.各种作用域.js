/*
1.js采用的是词法作用域: 
    1）定义在词法阶段的作用域，是静态作用域而不是动态作用域
    2）无论函数在哪被调用，函数的词法作用域只在函数定义的时候决定
*/

    var value = 1;
    function foo() {
        console.log(value); //定义处的value是1
    }
    function bar() {
        var value = 2;
        foo();
    }
    bar(); //1 如果是动态作用域结果就是2了

/*
2.全局作用域：
    1）全局变量:生命周期将存在于整个程序之内。能被程序中任何函数或者方法访问。可被修改所以避免不必要的全局变量声明
    2）显式var声明的变量会挂在window对象上，直接a = xxx隐式声明js会默认帮你声明为全局变量挂在window上
    3）我们写的函数如果不经过封装，也会是全局变量，他的生命周期也就是全局作用域
*/
var value = 1 ;
console.log(window.value) //1
function aaa(){
  a = 123
}
aaa() ;
console.log(window.a) //aaa()执行了结果是123，如果没执行就是undefined

console.log(window.aaa) //函数aaa
var b = 1
function bbb(){
  b=2
}
bbb()
console.log(b) //2

/*
3.函数作用域
*/