<template>
    <ul class="todo-list">

        <li
            v-for="todo of todos"
            :class="{completed: todo.completed}"
        >
            <div class="view">
                <input class="toggle" type="checkbox" />
                <label>{{todo.title}}</label>
                <button @click="remove(todo.id)" class="destroy"></button>
            </div>
        </li>

    </ul>
</template>

<script>
    export default {
        name: "todo-list",
        computed: {
            todos() {
                return this.$store.state.todos;
            }
        },
        methods: {
            remove(id) {
                this.$store.dispatch('remove', {id }).then(res => {
                    //alert('删除成功');
                }).catch( res => {
                    console.log(res)
                    alert('删除失败');
                } );
            }
        }
    }
</script>
