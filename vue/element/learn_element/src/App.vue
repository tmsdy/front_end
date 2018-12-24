<template>
  <div id="app">
    <!-- <layout /> -->
    <!-- <icon /> -->
    <transfer />
  </div>
</template>

<script>
import Layout from './components/basic/Layout.vue'
import Icon from './components/basic/Icon.vue'
import Transfer from './components/form/Transfer.vue'

export default {
  name: 'app',
  components: {
    Layout,Icon,Transfer
  }
}
</script>

<style>
#app{
  display: flex ;
  justify-content: center;
}
</style>
