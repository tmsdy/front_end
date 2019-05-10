

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
    // let qq = Parent('feifei') ; //不能把类当做函数用
    let p = new Parent('feifei') ;
    p.getNameAge() ; // feifei 22
    Parent.hello() ; // hello
    console.log(p)
    // p.hello() // p.hello is not a function
    // console.log(Object.getOwnPropertyDescriptor(p.__proto__, 'getNameAge')) //实例方法不可枚举

    class Child extends Parent{
        constructor(name){
            super(name)
            this.name = name
        }
    }
    let c = new Child('fangfang')
    c.getNameAge() ; // fangfang 22
    Child.hello() ; // hello
    // c.hello() // c.hello is not a function

    function People(name){
        this.name = name
    }
    let peo = new People('qwer')
    console.log(peo)

  }

})
