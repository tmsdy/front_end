

import Vue from 'vue'
import 'babel-polyfill'

new Vue({
  el:'#app' ,
  template: `
  <div></div>
  ` ,
  created(){

    class Parent{
        constructor(name){
            this.name = name ;
        }
        static age = 22 // 静态属性是class本身的属性
        static hello(){ // 静态方法是属于类的，不会被实例继承会被子类继承，直接Parent.hello()来调用不需要实例化。
            console.log('hello')
        }
        getNameAge(){ //实例方法，会被实例和子类继承
            console.log(this.name,Parent.age)
        }
    }

    let p = new Parent('feifei') ;
    p.getNameAge() ; // feifei 22
    Parent.hello() ; // hello
    // p.hello() // p.hello is not a function

    class Child extends Parent{
        constructor(name){
            super(name)
            this.name = name
        }
    }
    let c = new Child('fangfang')
    c.getNameAge() ; // fangfang 22
    Child.hello() ; // hello
    c.hello() // c.hello is not a function
    

  }

})
