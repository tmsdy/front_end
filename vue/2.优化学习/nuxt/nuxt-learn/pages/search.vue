<template>
    <div class="page">
        这是搜索页面
        <ul>
            组件数据：
            <li v-for="(item,idx) in list" :key="idx" >{{item}}</li>
        </ul>
        <ul>
            Vuex数据：
            <li v-for="(item,idx) in $store.state.city.list" :key="idx" >{{item}}</li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios' ;
export default {
  layout: 'search' ,
  data(){
      return {
          list:[]
      }
  },
  //服务器端不执行mounted阶段，吐出的页面没有这里面的数据，是在浏览器端走mounted的。一般用下面这种写法
  async asyncData() { 
      let {status,data:{list}} = await axios.get('http://localhost:3000/city/list') ;
    //   console.log(list) ;
      if(status === 200){
          return {
              list
          }
      }
  },
}
</script>
