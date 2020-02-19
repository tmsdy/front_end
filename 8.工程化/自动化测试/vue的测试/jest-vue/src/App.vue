<template>
  <div id="app">
    <div class="cover"></div>
    <TodoList />
  </div>
</template>

<script>
import TodoList from './containners/TodoList/TodoList'

export default {
  name: 'app',
  components: {
    TodoList
  }
}
</script>

<style lang="less">
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #555;
  opacity: 0.5;
  z-index: -1;
}
</style>
