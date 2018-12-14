import Vue from 'vue'

new Vue({
  // el:"#app" ,
  template: '<div>{{text}}</div>',
  data:{
    text: 'aaa'
  },
  beforeCreate(){
    console.log('beforeCreate') ;
  },
  created(){ //这里才能拿到data
    console.log('created')
  },
  //有el,或者实例用$mount挂载了才有beforeMount，mounted方法
  beforeMount(){ //$el是根节点
    console.log('beforeMount')
  },
  //生成render function 渲染优先级：render函数(自己写的)>template属性>外部html
  mounted(){ //$el是执行渲染后我们的DOM覆盖了根节点
    console.log('mounted') ;
    this.text = 'bbb'
  },
  beforeUpdate(){ //只有和模版中的数据绑定了才会发生更新
    console.log('beforeUpdate')
  },
  updated(){
    console.log('updated')
  },
  activated(){ //和组件的keep-alive有关
    console.log('activated')
  },
  deactivated(){
    console.log('deactivated')
  },
  beforeDestroy(){
    console.log('beforeDestroy')
  },
  destroyed(){
    console.log('destroyed')
  }
}).$mount('#app')

