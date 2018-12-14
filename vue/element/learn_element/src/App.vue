<template>
  <div id="app">
    <!-- <layout /> -->
    <icon />
  </div>
</template>

<script>
import Layout from './components/basic/Layout.vue'
import Icon from './components/basic/Icon.vue'

export default {
  name: 'app',
  components: {
    Layout,Icon
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
