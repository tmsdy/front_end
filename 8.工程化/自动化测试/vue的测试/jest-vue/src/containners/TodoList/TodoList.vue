<template>
  <div class="real-app">
    <Header @addTodoItem="addTodoItem"></Header>
    <TodoItem :todo="todo" v-for="todo in todoList" :key="todo.id" @del="deleteTodo"></TodoItem>
  </div>
</template>

<script>
import Header from './components/Header'
import TodoItem from './components/TodoItem'
let id = 0
export default {
  name: 'TodoList',
  components: {
    Header,
    TodoItem
  },
  props: {

  },
  data () {
    return {
      todoList: []
    }
  },
  methods: {
    addTodoItem (inputValue) {
      this.todoList.push({
        id: id++,
        content: inputValue,
        completed: false
      })
    },
    deleteTodo (id) {
      this.todoList.splice(this.todoList.findIndex(todo => todo.id === id), 1)
    }
  }
}
</script>

<style scoped lang="less">
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}
</style>
