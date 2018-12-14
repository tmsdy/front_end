<template>
  <div id="app">
    <p>信息：{{message}}</p>
    <input v-model="message" type="text" />
    <!-- 等效写法 v-model是个语法糖，addProp实现了:value="message2"，addHandler实现了@input="message2=$event.target.value"，只有细微区别-->
    <p>信息：{{message2}}</p>
    <input :value="message2" @input="message2=$event.target.value" type="text" />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  data(){
    return{
      message:'哈哈哈',
      message2:'111'
    }
  }
}
</script>

<style>

</style>
