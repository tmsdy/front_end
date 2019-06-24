<template>
    <section class="real-app">
        <input type="text" class="add-input" autofocus="autofocus" placeholder="接下来要去做什么？" @keyup.enter="addTodo">
        <item :todo="todo" v-for="todo in filteredTodos" :key="todo.id" @del="deleteTodo"></item>
        <Tabs :filter="filter" :todos="todos" @clearAllCompleted="clearAllCompleted" @toggle="toggleFilter"></Tabs>
        <router-view />
    </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
// import { throttle } from "lodash";
function debounce(func,delay){
    let timer = null
    return function(){
        if(timer) clearTimeout(timer)
        timer = setTimeout(()=>{
            func.apply(this,arguments)
        },delay)
    }
}
export default {
    props: ['todo_id'],
    components: {
        Item,
        Tabs
    },
    data() {
        return {
            id: 8,
            todos: [
                {
                    id: 0,
                    content: 'this is todo',
                    completed: false
                }
            ],
            filter: 'all'
        }
    },
    mounted() {
        console.log(debounce)
        // window.addEventListener('resize', this.getScale)
        window.addEventListener('resize', debounce(this.getScale, 500));
    },

    beforeDestroy() {
        console.log('beforeDestroy')
        window.removeEventListener('resize', this.getScale)
        // window.removeEventListener('resize', debounce(this.getScale, 500))
    },
    computed: {
        filteredTodos() {
            if (this.filter === 'all') {
                return this.todos
            }
            const completed = this.filter === 'completed'
            // completed的真假返回相应的数组
            return this.todos.filter(todo => completed === todo.completed);
        }
    },
    methods: {
        getScale() {
            console.log('getScale')
        },
        addTodo(e) {
            //unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
            this.todos.unshift({
                id: this.id++,
                content: e.target.value.trim(),
                completed: false
            })
            e.target.value = ''
        },
        deleteTodo(id) { //函数嵌套写法。找到想要的index，用splice删掉
            this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
        },
        clearAllCompleted() {
            this.todos = this.todos.filter(todo => todo.completed === false)
        },
        toggleFilter(state) {
            this.filter = state
        }
    }
}
</script>

<style lang="less" scoped>
.real-app {
    width: 600px;
    margin: 0 auto;
    box-shadow: 0 0 5px #666;
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
</style>
