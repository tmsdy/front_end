import Vue from 'vue'

let vm = new Vue({
  el: '#app' ,
  template: `
    <div>
      姓名：{{ name }}<br>
      年龄：{{age}}<br>
      性别：{{sex}}<br>
      说明：{{info.content}},{{info.key}}
      <div v-for="item in arr">{{item}}</div>
    </div>
  ` ,
  data:{
    name: "简书",
    age: '3',
    info: {
        content: '内容'
    },
    arr:[1,2,3]
  },
  created(){
    this.$set(this.info,'key','键值qwer');
    Vue.set(this.arr,2,10)
  },
  methods:{

  }
})

/*
1.vm.sex = '男' //这样设是没用的 虽然vm上有sex属性，但是没有setter和getter
console.log(vm)
2.由于js的限制，vue不能检测以下变动的数组
  1).直接利用索引设置一个项：vm.arr[1] = 10
  2).修改数组长度：vm.arr.length = 5
Vue.set( target, key, value )返回值：设置的值。

*/


