// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   components: { App },
//   template: '<App/>'
// })
let vm = new Vue({
  el: '#app',
  template: `
    <div>
      <p>信息：{{message}}</p>
      <input v-model="message" type="text" />
      <!-- 等效写法 -->
      <p>信息：{{message2}}</p>
      <input :value="message2" @input="message2=$event.target.value" type="text" />
    </div>
  `,
  data(){
    return {
      message:'哈哈哈',
      message2:'123'
    }
  }
})