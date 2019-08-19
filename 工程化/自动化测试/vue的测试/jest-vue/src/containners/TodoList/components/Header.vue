<template>
  <div class="main-header">
    <h1>TodoList</h1>
    <input type="text" class="add-input" autofocus="autofocus" @keyup.enter="addTodoItem" data-test="input" placeholder="做点什么吧～" v-model="inputVal">
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {

  },
  data () {
    return {
      inputVal: ''
    }
  },
  methods: {
    addTodoItem () {
      if (this.inputVal) {
        this.$emit('addTodoItem', this.inputVal)
      }
      this.inputVal = ''
    }
  }
}
</script>

<style scoped lang="less">
.main-header {
  text-align: center;
  h1 {
    font-size: 100px;
    color: rgba(175, 47, 47, 0.4);
    margin: 20px;
  }
  .add-input {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    outline: none;
    color: inherit;
    box-sizing: border-box;
    font-smoothing: antialiased;
    padding: 16px 16px 16px 36px;
    border: none;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }
}
</style>
