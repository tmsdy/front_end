<template>
    <div id="app">

        <section class="todoapp" id="todoApp">

            <todo-header @add="addNewTask"></todo-header>

            <todo-main :data="showTodos" @toggle="toggle" @toggleAll="toggleAll" @remove="remove"></todo-main>

            <todo-footer :count="unCompletedTasks.length" @removeAllCompleted="removeAllCompleted" :showType="showType" @changeShowType="changeShowType"></todo-footer>

        </section>

    </div>
</template>

<script>
    import todoHeader from '@/components/todoHeader';
    import todoMain from '@/components/todoMain';
    import todoFooter from '@/components/todoFooter';

    export default {
        name: 'App',
        components: {
            todoHeader,
            todoMain,
            todoFooter
        },
        data() {
            return {
                showType: 0,
                todos: [
                    {
                        id: '0' ,
                        title: '测试任务一',
                        completed: false
                    },
                    {
                        id:'1',
                        title: '测试任务二',
                        completed: true
                    }
                ]
            }
        },
        created(){
            let todos = JSON.parse(localStorage.getItem('todos'))
            this.todos = todos ;
        },
        computed: {
            unCompletedTasks() {
                return this.todos.filter(todo=>!todo.completed);
            },
            completedTasks() {
                return this.todos.filter(todo=>todo.completed);
            },
            showTodos() {
                switch (this.showType) {
                    default:
                    case 0:return this.todos;
                    case 1:return this.unCompletedTasks;
                    case 2:return this.completedTasks;
                }

            }
        },
        methods: {
            toggle(itemId) {
                let todo = this.todos.find(todo=>todo.id == itemId);
                todo.completed = !todo.completed;
            },
            toggleAll(checked) {
                // this.todos = this.todos.map( todo => {
                //     todo.completed = checked;
                //     return todo;
                // } );
                this.todos.forEach( todo => {
                    todo.completed = checked;
                } )
            },
            addNewTask(title) {
                this.todos.unshift({
                    id: Date.parse(new Date()) ,
                    title,
                    completed: false
                });
                localStorage.setItem('todos', JSON.stringify(this.todos) ) ;
            },
            remove(itemId) {
                this.todos = this.todos.filter( todo => {
                    return todo.id != itemId;
                } );
                localStorage.setItem('todos', JSON.stringify(this.todos) ) ;
            },
            removeAllCompleted() {
                this.todos = this.todos.filter(todo => !todo.completed);
            },
            changeShowType(showType) {
                this.showType = showType;
            }
        }
    }
</script>
