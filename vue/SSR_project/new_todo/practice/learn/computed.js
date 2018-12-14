import Vue from 'vue'

new Vue({
  el:'#app' ,
  template: `
  <div>
    <p>Name: {{name}}</p>
    <p>Name: {{getName()}}</p>
    <p>firstName:{{firstName}}<input type="text" v-model="firstName" ></p>
    <p>lastName:{{lastName}}<input type="text" v-model="lastName" ></p>

    <p>age:{{age}}<input type="text" v-model="age" ></p>
    <p>fullName:{{fullName}}</p>
    <p>obj.a:{{obj.a}}<input type="text" v-model="obj.a" ></p>
  </div>
  ` ,
  data:{
    firstName: 'han' ,
    lastName: 'fei' ,
    number: 22 ,
    fullName: '' ,
    obj:{
      a:'123'
    }
  },
  computed:{ // Object.defineProperty+缓存(解决每次都要计算问题)
    name(){
      console.log('name')
      return `${this.firstName} ${this.lastName}`
    },
    age:{ //一般不要这么搞容易循环爆栈(特别是修改你监听的值)
      get(){
        console.log('get') ;
        return this.number ;
      },
      set(age){
        console.log(age) ;
        this.number = age ;
      }
    }
  },
  watch:{ //用来监听一个数据变化来向后台发请求
    firstName:{
      handler(newName,oldName){ //监听firstName属性变化，默认变化才执行，可用handler+immediate直接执行
        this.fullName = newName+''+oldName ;
      },
      immediate:true
    },
    obj:{
      handler(){
        console.log('obj.a changed')
      },
      immediate:true ,
      deep:true //只有加了这个才能监听obj内部数据的变化，深入watch(性能开销大一点)，可以改成监听'obj.a'
    }
  },
  methods:{
    getName(){ //无论什么数据动了都会走这儿，很蠢
      console.log('getName')
      return `${this.firstName} ${this.lastName}`
    }
  }
})
