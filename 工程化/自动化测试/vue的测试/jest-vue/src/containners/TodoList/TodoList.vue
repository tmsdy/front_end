<template>
  <div>
    <h1>TodoList</h1>
    <Header></Header>
  </div>
</template>

<script>
import Header from './components/Header'
export default {
  name: 'TodoList',
  components: {
    Header
  },
  props: {

  }
}
</script>

<style scoped lang="less">
</style>
