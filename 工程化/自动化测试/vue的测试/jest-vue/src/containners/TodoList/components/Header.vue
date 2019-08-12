<template>
  <div>
    <h1>Header</h1>
    <input @keyup.enter="addTodoItem" data-test="input" v-model="inputVal">
    <div>{{inputVal}}</div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {

  },
  data() {
    return {
      inputVal: ''
    }
  },
  methods: {
    addTodoItem() {
      this.$emit('addTodoItem', this.inputVal)
    }
  }
}
</script>

<style scoped lang="less">
</style>
