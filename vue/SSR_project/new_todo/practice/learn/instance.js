import Vue from 'vue'

const vm = new Vue({
  // el:'#app' ,
  template: '<div ref="m_div">{{text}} {{obj.a}}</div>',
  data:{
    text : 0 ,
    obj:{}
  },
  // watch:{
  //   text: (newText,oldText)=>{
  //     console.log(`${newText} : ${oldText}`)
  //   }
  // }
})

vm.$mount('#app') ;
// console.log(vm) ;
// console.log(vm.$data) ;
// console.log(vm.$el) ;
// console.log(vm.$options) ;
// vm.$options.render = (h) =>{
//   return h('div',{},'new render function') ;
// }
let i = 0 ;
setInterval(()=>{
  // vm.text += 1 ; //正常用法
  // vm.$options.data += 1 ; //无效
  // vm._data.text += 1 ; //有效
  // vm.$data.text += 1 ; //有效
  i++ ;
  // vm.obj.a = i;// obj.a是没声明的，就算有值了页面也没渲染。
  // vm.$forceUpdate() ; //强制渲染一次,一般最好声明一下或者用vm.$set
  vm.$set(vm.obj,'a',i) //vue内部用defineReactive把obj.a变成响应式，可以用vm.$delete删除
},1000)

// console.log(vm.$root === vm) ;
// console.log(vm.$children) ; //子组件的东西
// console.log(vm.$slot) ;
// console.log(vm.$scopedSlots) ;
// console.log(vm.$refs) ;
// console.log(vm.$isServer) ; //服务端渲染

const unWatch = vm.$watch('text',(newText,oldText)=>{
  console.log(`${newText} : ${oldText}`)
})
//从一个组件跳到别的组件要注销原来的watch不然内存溢出
setTimeout(() => {
  unWatch() ; //调用就注销了
}, 2000);

vm.$on('test',(data)=>{
  console.log(`test事件被触发了,数据：${data}`)
})
// vm.$once() //这个这触发一次
vm.$emit('test', '123')

// vm.$nextTick([callBack]) , vue在下次更新时候调用这个callBack,可以用来调试渲染问题
//vue是异步渲染的，如果连续对text赋值了5次，它只会渲染最后一次的赋值结果
