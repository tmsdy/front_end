import Vue from 'vue'

/*
1.vue给常见指令提供缩略写法，但有些没有需要写完整的写法
2.:key写了，以后只要key没变就不会生成新节点直接复用之前的就行
3.number修饰符，失焦自动过滤成数字，别的地方用到这个也成数字。.trim是去掉空格
  .lazy是输入后失焦后相关数据才变化
*/
new Vue({
  el: '#app' ,
  template:`
    <div>
      <div v-text="text"></div>
      <div v-html="html"></div>
      <div v-show="active">v-show</div>
      <div v-if="active">v-if</div>
      <div v-else-if="!text">v-else-if</div>
      <div v-else>v-else</div>
      <ul>
        <li v-for="(item,index) in arr" :key="index">{{index}}: {{item}}</li>
      </ul>
      <ul>
        <li v-for="(val,key,index) in obj">{{key}}: {{val}}:{{index}}</li>
      </ul>
      <input type="text" v-model.number="text">
      <input type="checkbox" v-model="active" >
      <div>
        <input type="checkbox" :value="1" v-model="arr2" >
        <input type="checkbox" :value="2" v-model="arr2" >
        <input type="checkbox" :value="3" v-model="arr2" >
      </div>
      <div>
        <input type="radio" :value="one" v-model="picked" >
        <input type="radio" :value="two" v-model="picked" >
      </div>
    </div>

  `,
  data:{ // v-show是用display:none/block来实现显示隐藏，而v-if是对节点的增删控制的(会有回流性能偏低)
    text: 'hello' ,
    active:false ,
    html: '<p>this is html</p>',
    arr:['feifei','honghong','nanan'],
    obj:{ //Object.keys来实现吧
      a: '123' ,
      b: '456' ,
      c: '789'
    },
    arr2: [1,2,3] ,
    picked: ''
  }
})
