import Vue from 'vue'

new Vue({
  el: '#app' ,
  template: `
    <div @click="myClick">
      <div>{{isActive ? 'active' : 'not active'}}</div>
      <div>{{arr[0]}}</div>
      <div>{{html}}</div>
      <div v-html="html"></div>
      <div :class="{active:isActive}"></div>
      <div :class="[isActive?'active':'']"></div>
      <div :class="[{active:isActive},{isActive:isActive}]"></div>
    </div>
  ` ,
  data:{
    isActive:true ,
    arr: [1,2,3] ,
    html: '<span>123</span>' ,// 得用v-html，{{html}}不行vue会转译字符串防止注入攻击
    my_class:'big_shark'
  },
  methods:{
    myClick(){ //不用担心绑定很多事件性能低，vue有处理
      console.log('myClick') ;
    }
  }
})

