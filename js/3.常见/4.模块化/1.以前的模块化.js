// 1.函数封装 缺点：污染全局作用域
  function fn1() {
    // balabalabala
  }

/*
2.nameSpace模式
  1）没有私有变量，外部能改，不安全
*/
var myModule = {
    var1: 1,
    var2: 2,
    fn1: function(){
      console.log(this.var1)
    },
    fn2: function(){
      console.log(this.var2)
    },
}
myModule.fn1()

//  3.立即执行函数(IIFE模式) 
let myModule2 = (function(){
  let _private = "私有123"
  var foo = function(){
    console.log(_private)
  }
  return {
    foo
  }
})()
myModule2.foo() // 私有123
console.log(myModule2._private) // undefined

// 再增强一点：引入依赖。是现代模块实现的基石
let myModule2 = (function($){ //这样在里面就能用jquery了
  let _$body = $('body')
  var foo = function(){
    console.log(_$body) //特权方法
  }
  return {
    foo
  }
})(jQuery)