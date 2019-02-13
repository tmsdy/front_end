<template>
  <section class="real-app">
    <input ref="m_input" type="text" class="add-input" autofocus="autofocus" placeholder="接下来要去做什么？"
            @keyup.enter="addTodo">
    <item :todo="todo"
      v-for="todo in filteredTodos"
      :key="todo.id"
      @del="deleteTodo"></item>
    <Tabs 
        :filter="filter" 
        :todos="todos" 
        @clearAllCompleted="clearAllCompleted" 
        @toggle="toggleFilter"
    ></Tabs>
  </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'

export default {
  components:{
    Item,
    Tabs
  },
  data(){
    return {
      id:8 ,
      todos:[
        {
          id: 0,
          content:'this is todo',
          completed:false
        }
      ],
      filter:'all'
    }
  },
  mounted(){
    console.log(this)
  },
  computed:{
    filteredTodos(){
        if(this.filter==='all'){
            return this.todos
        }
        const completed = this.filter ==='completed'
        // completed的真假返回相应的数组
        return this.todos.filter(todo => completed === todo.completed);
    }
  },
  methods: {
    addTodo(e){
      //unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
      this.todos.unshift({
          id: this.id++,
          content:e.target.value.trim(),
          completed:false
      })
      e.target.value = ''
    },
    deleteTodo(id){ //函数嵌套写法。找到想要的index，用splice删掉
        this.todos.splice(this.todos.findIndex(todo => todo.id === id),1)
    },
    clearAllCompleted() {
        this.todos = this.todos.filter(todo => todo.completed === false)
    },
    toggleFilter(state){
        this.filter = state
    }
  }
}
</script>

<style lang="less" scoped>
@rem:30rem ;
    .real-app {
        width:600/@rem ; 
        margin:0 auto ; 
        box-shadow:0 0 5/@rem #666 ; 
    }
    .add-input {
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24/@rem;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16/@rem 16/@rem 16/@rem 36/@rem;
        border: none;
        box-shadow: inset 0 -2/@rem 1/@rem rgba(0, 0, 0, 0.03);
    }
</style>
