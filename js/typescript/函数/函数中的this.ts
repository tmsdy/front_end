/*
 1.ts中的默认函数中的this指向any
 */

 function fn(){
  // this ;//any 这样this.下面不会提示东西和类型检测
  // noImplictThis 可以取消默认this的any
 }

 let obj = {
  a:12 ,
  fn(){
    // this ;//any
    console.log(this.a) //实际执行结果不会变
  }
 }